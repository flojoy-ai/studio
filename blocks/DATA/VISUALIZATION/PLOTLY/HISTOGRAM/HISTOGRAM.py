import pandas as pd
import plotly.graph_objects as go
from flojoy import DataFrame, Matrix, OrderedPair, Plotly, Vector, flojoy
from blocks.DATA.VISUALIZATION.template import plot_layout


@flojoy
def HISTOGRAM(default: OrderedPair | DataFrame | Matrix | Vector) -> Plotly:
    """Create a Plotly Histogram visualization for a given input DataContainer.

    Parameters
    ----------
    default : OrderedPair|DataFrame|Matrix|Vector
        the DataContainer to be visualized

    Returns
    -------
    Plotly
        the DataContainer containing the Plotly Histogram visualization
    """

    layout = plot_layout(title="HISTOGRAM")
    fig = go.Figure(layout=layout)

    match default:
        case OrderedPair():
            y = default.y
            fig.add_trace(go.Histogram(x=y))
        case DataFrame():
            df = pd.DataFrame(default.m)
            for col in df.columns:
                fig.add_trace(go.Histogram(x=df[col], name=col))

            fig.update_layout(xaxis_title="Value", yaxis_title="Frequency")
        case Matrix():
            m = default.m
            flattened_matrix = m.flatten()
            histogram_trace = go.Histogram(x=flattened_matrix)
            fig = fig.add_trace(histogram_trace)
        case Vector():
            v = default.v
            fig.add_trace(go.Histogram(x=v))

    return Plotly(fig=fig)
