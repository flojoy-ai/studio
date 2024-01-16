from flojoy import (
    flojoy,
    Plotly,
    OrderedPair,
    DefaultParams,
    SmallMemory,
    Scalar,
    Vector,
)
from typing import cast
import plotly.graph_objects as go
from blocks.DATA.VISUALIZATION.template import plot_layout

MEMORY_KEY = "BIG_NUMBER_MEMORY_KEY"


@flojoy(inject_node_metadata=True)
def BIG_NUMBER(
    default: OrderedPair | Scalar | Vector,
    default_params: DefaultParams,
    suffix: str,
    prefix: str,
    title: str,
    dec_places: int = 0,
    relative_delta: bool = True,
    scientific_notation: bool = False,
) -> Plotly:
    """Generate a Plotly figure, displaying a big number with an optional prefix and suffix.

    Inputs
    ------
    default : OrderedPair|Scalar|Vector
        the DataContainer to be visualized

    Parameters
    ----------
    relative_delta : bool
        whether or not to show the relative delta from the last run along with big number
    suffix : str
        any suffix to show with big number
    prefix : str
        any prefix to show with big number
    title : str
        title of the plot, default = "BIG_NUMBER"
    dec_places : int
        Number of decimal places. Use 0 to not round. default = "BIG_NUMBER"
    scientific_notation : bool
        Use scientific notation? Defaults to 4 decimal places.

    Returns
    -------
    Plotly
        the DataContainer containing the Plotly big number visualization
    """

    job_id = default_params.job_id
    node_name = __name__.split(".")[-1]
    layout = plot_layout(title=title if title else node_name)
    fig = go.Figure(layout=layout)

    prev_num = cast(str, SmallMemory().read_memory(job_id, MEMORY_KEY))
    match default:
        case OrderedPair():
            big_num = default.y[-1]
        case Scalar():
            big_num = default.c
        case Vector():
            big_num = default.v[-1]
        case _:
            raise ValueError(f"Invalid input type {type(default)} for node {node_name}")

    delta_val_format = ".1%" if relative_delta is True else ".1f"
    if dec_places == 0:
        val_format = "%g" if scientific_notation is False else ".4e"
    else:
        val_format = (
            f".{dec_places}f" if scientific_notation is False else f".{dec_places}e"
        )

    fig.add_trace(
        go.Indicator(
            mode="number+delta",
            value=big_num,
            domain={"y": [0, 1], "x": [0, 1]},
            number={"prefix": prefix, "suffix": suffix, "valueformat": val_format},
            delta=None
            if prev_num is None
            else {
                "reference": float(prev_num),
                "relative": relative_delta,
                "valueformat": delta_val_format,
            },
        )
    )
    SmallMemory().write_to_memory(job_id, MEMORY_KEY, str(float(big_num)))

    return Plotly(fig=fig)
