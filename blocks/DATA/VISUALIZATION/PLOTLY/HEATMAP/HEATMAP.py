from flojoy import (
    Plotly,
    OrderedPair,
    flojoy,
    Matrix,
    Grayscale,
    DataFrame,
    Vector,
    OrderedTriple,
)
import plotly.graph_objects as go
import plotly.express as px
from plotly.subplots import make_subplots

import numpy as np
from blocks.DATA.VISUALIZATION.template import plot_layout


@flojoy
def HEATMAP(
    default: OrderedPair | Matrix | Grayscale | DataFrame | Vector | OrderedTriple,
    show_text: bool = False,
    histogram: bool = False,
) -> Plotly:
    """Create a Plotly Heatmap visualization for a given input DataContainer.

    Inputs
    ------
    default : OrderedPair|OrderedTriple|DataFrame|Vector|Matrix|Grayscale
        the DataContainer to be visualized

    Parameters
    ----------
    show_text : bool
        whether or not to show the text inside the heatmap color blocks
    histogram : bool
        whether or not to render a histogram of the image next to the render

    Returns
    -------
    Plotly
        the DataContainer containing the Plotly heatmap visualization

    """
    layout = plot_layout(title="HEATMAP")
    if histogram:
        layout.sliders = [
            {
                "steps": [
                    {
                        "label": str(v),
                        "method": "restyle",
                        "args": [{"zmin": 0, "zmax": v}],
                    }
                    for v in range(1, 255, 1)
                ],
                "name": "zmax",
            },
        ]
    text_template = "%{text}"

    fig = (
        go.Figure()
        if not histogram
        else make_subplots(
            rows=1,
            cols=2,
            column_widths=[0.9, 0.1],
            specs=[[{}, {}]],
            horizontal_spacing=0.05,
        )
    )
    match default:
        case Vector():
            z = default.v
            if z.ndim < 2:
                num_columns = len(z) // 2
                z = np.reshape(z, (2, num_columns))
            fig.add_trace(
                go.Heatmap(
                    z=z,
                    text=z if show_text else None,
                    texttemplate=text_template,
                ),
                row=None if not histogram else 1,
                col=None if not histogram else 1,
            )
            if histogram:
                histogram = np.histogram(z, bins="auto")
                x_values = histogram[1][:-1] + 0.05  # Center bars on bin edges
                histogram_trace = go.Bar(
                    x=x_values, y=histogram[0], orientation="h", showlegend=False
                )
                fig.add_trace(histogram_trace, row=1, col=2)
        case OrderedPair():
            z = default.y
            if default.y.ndim < 2:
                num_columns = len(default.y) // 2
                z = np.reshape(default.y, (2, num_columns))
            fig.add_trace(
                go.Heatmap(
                    z=z,
                    x=default.x,
                    y=default.y,
                    text=z if show_text else None,
                    texttemplate=text_template,
                ),
                row=None if not histogram else 1,
                col=None if not histogram else 1,
            )
            if histogram:
                histogram = np.histogram(z, bins="auto")
                x_values = histogram[1][:-1] + 0.05  # Center bars on bin edges
                histogram_trace = go.Bar(
                    x=x_values, y=histogram[0], orientation="h", showlegend=False
                )
                fig.add_trace(histogram_trace, row=1, col=2)
        case OrderedTriple():
            x = np.unique(default.x)
            y = np.unique(default.y)
            z_size = len(x) * len(y)
            if z_size > len(default.z):
                z = np.pad(
                    default.z, (0, z_size - len(default.z)), mode="constant"
                ).reshape(len(y), len(x))
            else:
                z = default.z[:z_size].reshape(len(y), len(x))
            if z.ndim < 2:
                num_columns = len(z) // 2
                z = np.reshape(z, (2, num_columns))
            fig.add_trace(
                go.Heatmap(
                    z=z,
                    x=x,
                    y=y,
                    text=z if show_text else None,
                    texttemplate=text_template,
                ),
                row=None if not histogram else 1,
                col=None if not histogram else 1,
            )
            if histogram:
                histogram = np.histogram(z, bins="auto")
                x_values = histogram[1][:-1] + 0.05  # Center bars on bin edges
                histogram_trace = go.Bar(
                    x=x_values, y=histogram[0], orientation="h", showlegend=False
                )
                fig.add_trace(histogram_trace, row=1, col=2)
        case Matrix():
            m = default.m
            if m.ndim < 2:
                num_columns = len(m) // 2
                m = np.reshape(m, (2, num_columns))
            fig.add_trace(
                go.Heatmap(
                    z=m,
                    text=m if show_text else None,
                    texttemplate=text_template,
                ),
                row=None if not histogram else 1,
                col=None if not histogram else 1,
            )
            if histogram:
                histogram = np.histogram(m, bins="auto")
                x_values = histogram[1][:-1] + 0.05  # Center bars on bin edges
                histogram_trace = go.Bar(
                    x=x_values, y=histogram[0], orientation="h", showlegend=False
                )
                fig.add_trace(histogram_trace, row=1, col=2)
        case Grayscale():
            m = default.m

            fig.add_trace(
                go.Heatmap(
                    z=m,
                    text=m if show_text else None,
                    texttemplate=text_template,
                ),
                row=None if not histogram else 1,
                col=None if not histogram else 1,
            )
            if histogram:
                histogram = np.histogram(m, bins="auto")
                x_values = histogram[1][:-1] + 0.05  # Center bars on bin edges
                histogram_trace = go.Bar(
                    y=x_values, x=histogram[0], orientation="h", showlegend=False
                )
                fig.add_trace(histogram_trace, row=1, col=2)
        case DataFrame():
            df = default.m
            fig = px.imshow(df, text_auto=show_text)

    if histogram:
        layout.xaxis2 = dict(
            tickmode="array",
            tickvals=[0, histogram[0].max()],
            ticktext=["0", f"{histogram[0].max():.0f}"],
        )
        layout.yaxis2 = dict(
            tickmode="array",
            tickvals=[x_values.min(), x_values.max()],
            ticktext=["", ""],
        )
    fig.update_layout(layout)
    return Plotly(
        fig=fig,
    )
