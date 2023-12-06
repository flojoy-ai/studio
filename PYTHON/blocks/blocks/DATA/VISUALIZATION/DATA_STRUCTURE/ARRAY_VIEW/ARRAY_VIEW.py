import numpy as np
import plotly.graph_objects as go
from flojoy import DataFrame, Image, Matrix, OrderedPair, Plotly, flojoy

CELL_SIZE = 50
FONT_SIZE = 10
MAX_ALLOWED_SHAPE = 10
l_dot = "$\\ldots$"


def numpy_array_as_table(arr: np.ndarray):
    if arr.size > MAX_ALLOWED_SHAPE:
        converted_type = arr.astype(object)
        new_arr = converted_type[:MAX_ALLOWED_SHAPE]
        new_arr[MAX_ALLOWED_SHAPE - 2] = l_dot
    else:
        new_arr = arr
    return new_arr.reshape(-1, 1)


@flojoy
def ARRAY_VIEW(default: OrderedPair | Matrix | DataFrame | Image) -> Plotly:
    """The ARRAY_VIEW node takes OrderedPair, DataFrame, Matrix, and Image DataContainer objects as input, and visualizes it in array format.

    Parameters
    ----------
    default : OrderedPair | DataFrame | Matrix | Image
        the DataContainer to be visualized in array format

    Returns
    -------
    Plotly
        the DataContainer containing the visualization of the input in array format
    """

    if isinstance(default, OrderedPair):
        data = default.y
        cell_values = numpy_array_as_table(data)
    elif isinstance(default, DataFrame):
        data = default.m.to_numpy(dtype=object)
        data = data[:, :-1]
        cell_values = numpy_array_as_table(data)
    elif isinstance(default, Matrix):
        data = default.m
        cell_values = numpy_array_as_table(data)
    else:
        red = default.r
        green = default.g
        blue = default.b

        if default.a is None:
            merge = np.stack((red, green, blue), axis=2)
        else:
            alpha = default.a
            merge = np.stack((red, green, blue, alpha), axis=2)

        merge = merge.reshape(-1, merge.shape[-1])
        cell_values = numpy_array_as_table(merge)

    fig = go.Figure(
        data=[
            go.Table(
                header=dict(line={"width": 0}, values=[]),
                cells=dict(
                    values=cell_values,
                    line={"width": 3},
                    font={"size": FONT_SIZE},
                    height=CELL_SIZE,
                    align="center",
                    format=[".3"],
                ),
            )
        ]
    )
    if default.type == "image" or default.type == "dataframe":
        width = MAX_ALLOWED_SHAPE * CELL_SIZE + 800

    else:
        width = MAX_ALLOWED_SHAPE * CELL_SIZE + 80
    height = width + 80
    fig.layout = go.Layout(
        autosize=False,
        width=width,
        height=height,
        margin=dict(l=0, r=0, t=0, b=0),
        xaxis=dict(visible=False),
        yaxis=dict(visible=False),
        hovermode="closest",
        font=dict(size=FONT_SIZE),
    )

    return Plotly(fig=fig)
