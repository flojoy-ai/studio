from flojoy import flojoy, Plotly, Image, Grayscale, Matrix
import plotly.express as px
import plotly.graph_objects as go
from skimage.draw import ellipse
from skimage.measure import label, regionprops, find_contours
from skimage.transform import rotate
import re
import numpy as np
from typing import Optional
import math
from blocks.DATA.VISUALIZATION.template import plot_layout
from PIL import Image as PILImage


@flojoy(deps={"scikit-image": "0.21.0"}, node_type="VISUALIZERS")
def REGION_PROPERTIES(default: Optional[Image | Grayscale | Matrix] = None) -> Plotly:
    """A stand-alone visualizer for analyzing an input array of image data.

    There are multiple input 'DataContainer' types for which
    this function is applicable: 'Image', 'Grayscale', or 'Matrix'.

    Often in image analysis, it is necessary to determine subvolumes / subregions
    inside a given image, whether for object count (e.g. the counting of
    cells on a glass plate), or object dimensional analysis (determining coutours of
    a region, centroid of a region relative to the pixel coordinate origin of the image,
    determining the semi-major or -minor axes of a region, etc.). This functionality
    is entirely provided by this node in a two-step process:

    - First, the regions of the INTEGER image are identified and labelled.
    - Second, the regions are analyzed.

    The first step is provided by the morphology library of scikit-image's label function,
    while the second is provided by scikit-image's regionprops function.

    After processing, the results of this node are visualized in the main UI,
    where the user can see:
    - The input array / image.
    - The semi-major and semi-minor axes of the contour drawn relative to the contour centroid.
    - The contour centroid.
    - The countour bounding-box.
    - A mouse-hover utility that displays the contour information to the user.

    Parameters
    ----------
    default : Image | Grayscale
        The input node to this function.
        If nothing is supplied, a demo test case is returned to illustrate the functionality of this node.

    Returns
    -------
    fig: Plotly
        A Plotly figure containing the illustrated features as determined by this node.
    """

    if default:
        if isinstance(default, Image):
            r = default.r
            g = default.g
            b = default.b
            a = default.a

            if a is None:
                image = np.stack((r, g, b), axis=2)
            else:
                image = np.stack((r, g, b, a), axis=2)
            image = PILImage.fromarray(image)
            image = np.array(
                image.convert("L"), dtype=np.uint8
            )  # a greyscale image that can be processed
        elif isinstance(default, Grayscale) or isinstance(default, Matrix):
            image = np.array(default.m)  # explicit typing just to be extra safe

    else:
        image = np.zeros((600, 600), dtype=np.uint8)
        rr, cc = ellipse(300, 350, 100, 220)
        image[rr, cc] = 1
        image = rotate(image, angle=15, order=0)
        rr, cc = ellipse(100, 100, 60, 50)
        image[rr, cc] = 1

    # Slight problem. If we're generating a dummy dataset, or if the input is of
    # type `Image`, then there is no problem for the below, since all values will
    # be in range 0-255 (uint8). This is good because the array `rgb_image` below
    # is guaranteed to be able to work and visualize the input array, and the `label`
    # are `regionprops` routines, which only accept integer array inputs, will be fine
    # as well. PROBLEM: if the input type is greyscale or matrix, meaning only a 2D
    # array, we have at no point enforced that the values of these arrays be uint8.
    # Indeed, they may not and in most cases will not be, and can have values within
    # an extreme dynamic range. To fix this, we need a case to explicitly handle greyscale
    # and matrix input data types, both for visualization and for region property analysis.
    original_dtype = str(np.min_scalar_type(image))
    if "int" in original_dtype:  # we are good, and all are integers
        pass
    elif "f" in original_dtype:  # matches 'float' and 'f8' etc
        nbits = int(re.search(r"\d+", str(original_dtype)).group())
        image = image.astype(getattr(np, f"int{nbits}"))
    else:
        raise TypeError(
            "Input array of insufficient data type to pass to the region analysis routines."
        )
    labels = label(image)
    rprops = regionprops(label_image=labels, intensity_image=image)

    rgb_image = np.zeros(
        (*image.shape, 3), dtype=np.uint8
    )  # only generated for plotting
    rgb_image[..., 0] = image * 255  # Red channel
    rgb_image[..., 1] = image * 255  # Green channel
    rgb_image[..., 2] = image * 255  # Blue channel
    layout = plot_layout(title=f"IMAGE with {labels.max()} objects")
    fig = px.imshow(img=rgb_image)
    fig.layout = layout

    properties = [
        "area",
        "eccentricity",
        "perimeter",
        "centroid",
        "orientation",
        "axis_major_length",
        "axis_minor_length",
    ]

    for props in rprops:
        y0, x0 = props.centroid
        orientation = props.orientation
        x1 = x0 + math.cos(orientation) * 0.5 * props.axis_minor_length
        y1 = y0 - math.sin(orientation) * 0.5 * props.axis_minor_length
        x2 = x0 - math.sin(orientation) * 0.5 * props.axis_major_length
        y2 = y0 - math.cos(orientation) * 0.5 * props.axis_major_length

        line_trace1 = go.Scatter(
            x=[x0, x1],
            y=[y0, y1],
            mode="lines",
            line=dict(color="red", width=2.5),
            showlegend=False,
        )
        line_trace2 = go.Scatter(
            x=[x0, x2],
            y=[y0, y2],
            mode="lines",
            line=dict(color="red", width=2.5),
            showlegend=False,
        )
        marker_trace = go.Scatter(
            x=[x0],
            y=[y0],
            mode="markers",
            marker=dict(color="green", size=15),
            showlegend=False,
        )

        fig.add_trace(line_trace1)
        fig.add_trace(line_trace2)
        fig.add_trace(marker_trace)

        minr, minc, maxr, maxc = props.bbox
        bx = [minc, maxc, maxc, minc, minc]
        by = [minr, minr, maxr, maxr, minr]

        bounding_box_trace = go.Scatter(
            x=bx, y=by, mode="lines", line=dict(color="blue", width=2), showlegend=False
        )
        fig.add_trace(bounding_box_trace)

    for index in range(labels.max()):
        label_i = rprops[index].label
        contour = find_contours(labels == label_i, 0.5)[0]
        y, x = contour.T
        hoverinfo = ""
        for prop_name in properties:
            val = getattr(rprops[index], prop_name)
            if type(val) == tuple:
                line = [
                    f" <b>{prop_name}_{idv}: {v:.2f}</b>" for idv, v in enumerate(val)
                ]
                hoverinfo += ",".join(line) + "<br>"
            else:
                hoverinfo += f"<b>{prop_name}: {val:.2f}</b><br>"
        fig.add_trace(
            go.Scatter(
                x=x,
                y=y,
                name=label_i,
                mode="lines",
                fill="toself",
                showlegend=False,
                hovertemplate=hoverinfo,
                hoveron="points+fills",
            )
        )

    fig.update_xaxes(range=[0, image.shape[0]])
    fig.update_yaxes(range=[0, image.shape[1]])
    return Plotly(fig=fig)
