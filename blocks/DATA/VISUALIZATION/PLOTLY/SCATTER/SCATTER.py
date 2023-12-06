import numpy as np
import pandas as pd
import plotly.graph_objects as go
from flojoy import DataFrame, Matrix, OrderedPair, Plotly, Vector, flojoy
from blocks.DATA.VISUALIZATION.template import plot_layout


@flojoy
def SCATTER(default: OrderedPair | DataFrame | Matrix | Vector) -> Plotly:
    """Create a Plotly Scatter visualization for a given input DataContainer.

    Parameters
    ----------
    default : OrderedPair|DataFrame|Matrix|Vector
        the DataContainer to be visualized

    Returns
    -------
    Plotly
        the DataContainer containing the Plotly Scatter visualization
    """

    layout = plot_layout(title="SCATTER")
    fig = go.Figure(layout=layout)
    match default:
        case OrderedPair():
            x = default.x
            if isinstance(default.x, dict):
                dict_keys = list(default.x.keys())
                x = default.x[dict_keys[0]]
            y = default.y
            fig.add_trace(go.Scatter(x=x, y=y, mode="markers", marker=dict(size=4)))
        case DataFrame():
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

        case Matrix():
            m: np.ndarray = default.m
            num_rows, num_cols = m.shape

            x_ticks = np.arange(num_cols)

            for i in range(num_rows):
                fig.add_trace(
                    go.Scatter(x=x_ticks, y=m[i, :], name=f"Row {i+1}", mode="markers")
                )

            fig.update_layout(xaxis_title="Column", yaxis_title="Value")
        case Vector():
            y = default.v
            x = np.arange(len(y))
            fig.add_trace(go.Scatter(x=x, y=y, mode="markers", marker=dict(size=4)))

    return Plotly(fig=fig)
