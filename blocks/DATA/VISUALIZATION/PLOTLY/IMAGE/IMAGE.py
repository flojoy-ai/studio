import numpy as np
import plotly.express as px
from flojoy import Grayscale, Image, Plotly, flojoy
from blocks.DATA.VISUALIZATION.template import plot_layout


@flojoy
def IMAGE(default: Image | Grayscale) -> Plotly:
    """Create a Plotly Image visualization for a given input DataContainer type of image.

    Parameters
    ----------
    default : Image
        the DataContainer to be visualized

    Returns
    -------
    Plotly
        the DataContainer containing the Plotly Image visualization of the input image
    """

    layout = plot_layout(title="IMAGE")

    if isinstance(default, Image):
        r = default.r
        g = default.g
        b = default.b
        a = default.a

        if a is None:
            img_combined = np.stack((r, g, b), axis=2)
        else:
            img_combined = np.stack((r, g, b, a), axis=2)
        fig = px.imshow(img=img_combined)

    else:
        img = default.m
        rgb_image = np.zeros(
            (*img.shape, 3), dtype=np.uint8
        )  # only generated for plotting
        rgb_image[..., 0] = img * 255  # Red channel
        rgb_image[..., 1] = img * 255  # Green channel
        rgb_image[..., 2] = img * 255  # Blue channel
        fig = px.imshow(img=rgb_image)

    fig.layout = layout

    return Plotly(fig=fig)
