import numpy as np
import pandas as pd
import plotly.graph_objects as go
from flojoy import DataFrame, Matrix, OrderedPair, Plotly, flojoy
from nodes.VISUALIZERS.template import plot_layout


@flojoy
def SCATTER(default: OrderedPair | DataFrame | Matrix) -> Plotly:
    """The SCATTER Node creates a Plotly Scatter visualization for a given input data container.

    Parameters:
    ----------
    None

    Supported DC types:
    -------------------
    `ordered_pair`, `dataframe`, `matrix`
    """
    layout = plot_layout(title="SCATTER")
    fig = go.Figure(layout=layout)

    if isinstance(default, OrderedPair):
        x = default.x
        if isinstance(default.x, dict):
            dict_keys = list(default.x.keys())
            x = default.x[dict_keys[0]]
        y = default.y
        fig.add_trace(go.Scatter(x=x, y=y, mode="markers", marker=dict(size=4)))
    elif isinstance(default, DataFrame):
        df = pd.DataFrame(default.m)
        first_col = df.iloc[:, 0]
        is_timeseries = False
        if pd.api.types.is_datetime64_any_dtype(first_col):
            is_timeseries = True
        if is_timeseries:
            for col in df.columns:
                if col != df.columns[0]:
                    fig.add_trace(
                        go.Scatter(x=first_col, y=df[col], mode="markers", name=col)
                    )
        else:
            for col in df.columns:
                fig.add_trace(
                    go.Scatter(x=df.index, y=df[col], mode="markers", name=col)
                )
    else:
        m: np.ndarray = default.m
        num_rows, num_cols = m.shape

        x_ticks = np.arange(num_cols)

        for i in range(num_rows):
            fig.add_trace(
                go.Scatter(x=x_ticks, y=m[i, :], name=f"Row {i+1}", mode="markers")
            )

        fig.update_layout(xaxis_title="Column", yaxis_title="Value")

    return Plotly(fig=fig)
