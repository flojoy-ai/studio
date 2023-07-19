import pandas as pd
import plotly.graph_objects as go
from flojoy import flojoy, OrderedPair, DataFrame, Matrix, Plotly
from nodes.VISUALIZERS.template import plot_layout


@flojoy
def HISTOGRAM(default: OrderedPair | DataFrame | Matrix) -> Plotly:
    """The HISTOGRAM node creates a Plotly Histogram visualization for a given
    input data container.

    Parameters:
    -----------
    None

    Supported DC types:
    ------------------
    `ordered_pair`, `dataframe`, `matrix`

    """
    layout = plot_layout(title="HISTOGRAM")
    fig = go.Figure(layout=layout)

    if isinstance(default, OrderedPair):
        y = default.y
        fig.add_trace(go.Histogram(x=y))
    elif isinstance(default, DataFrame):
        df = pd.DataFrame(default.m)
        for col in df.columns:
            fig.add_trace(go.Histogram(x=df[col], name=col))

        fig.update_layout(xaxis_title="Value", yaxis_title="Frequency")
    else:
        m = default.m
        flattened_matrix = m.flatten()
        histogram_trace = go.Histogram(x=flattened_matrix)

        fig = fig.add_trace(histogram_trace)

    return Plotly(fig=fig)
