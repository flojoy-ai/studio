import plotly.graph_objects as go
from flojoy import DataFrame, Matrix, OrderedPair, Plotly, Vector, flojoy
from blocks.DATA.VISUALIZATION.template import plot_layout
from numpy import arange
from pandas.api.types import is_datetime64_any_dtype


@flojoy
def LINE(
    default: OrderedPair | DataFrame | Matrix | Vector,
    xaxis_title: str = "",
    yaxis_title: str = "",
    x_log_scale: bool = False,
    y_log_scale: bool = False,
) -> Plotly:
    """Create a Plotly Line visualization for a given input DataContainer.

    Parameters
    ----------
    default : OrderedPair|DataFrame|Matrix|Vector
        the DataContainer to be visualized
    xaxis_title: str
        Choose the label for the x axis.
    yaxis_title: str
        Choose the label for the y axis.

    Returns
    -------
    Plotly
        the DataContainer containing the Plotly Line visualization of the input data
    """

    layout = plot_layout(title="LINE")
    fig = go.Figure(layout=layout)

    match default:
        case OrderedPair():
            x = default.x
            if isinstance(default.x, dict):
                dict_keys = list(default.x.keys())
                x = default.x[dict_keys[0]]
            y = default.y
            fig.add_trace(go.Scatter(x=x, y=y, mode="lines"))
        case DataFrame():
            df = default.m
            first_col = df.iloc[:, 0]
            is_timeseries = False
            if is_datetime64_any_dtype(first_col):
                is_timeseries = True
            if is_timeseries:
                for col in df.columns:
                    if col != df.columns[0]:
                        fig.add_trace(
                            go.Scatter(
                                y=df[col].values,
                                x=first_col,
                                mode="lines",
                                name=col,
                            )
                        )
            else:
                for col in df.columns:
                    fig.add_trace(
                        go.Scatter(
                            y=df[col].values,
                            x=df.index,
                            mode="lines",
                            name=col,
                        )
                    )

        case Matrix():
            m = default.m

            num_rows, num_cols = m.shape

            x_ticks = arange(num_cols)

            for i in range(num_rows):
                fig.add_trace(
                    go.Scatter(x=x_ticks, y=m[i, :], name=f"Row {i+1}", mode="lines")
                )

            fig.update_layout(xaxis_title="Column", yaxis_title="Value")
        case Vector():
            y = default.v
            x = arange(len(y))
            fig.add_trace(go.Scatter(x=x, y=y, mode="lines"))

    if xaxis_title != "":
        fig.update_layout(
            xaxis_title=xaxis_title,
        )
    if yaxis_title != "":
        fig.update_layout(
            yaxis_title=yaxis_title,
        )
    if x_log_scale:
        fig.update_xaxes(type="log")
    if y_log_scale:
        fig.update_yaxes(type="log")

    return Plotly(fig=fig)
