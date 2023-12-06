from flojoy import flojoy, OrderedPair, DataFrame, Matrix, Plotly, Vector
import plotly.graph_objects as go
import pandas as pd
import numpy as np
from blocks.DATA.VISUALIZATION.template import plot_layout
from typing import Literal


@flojoy
def COMPOSITE(
    primary_trace: OrderedPair | DataFrame | Matrix | Vector,
    secondary_trace: OrderedPair | DataFrame | Matrix | Vector,
    first_figure: Literal["bar", "line", "histogram", "scatter"] = "scatter",
    second_figure: Literal["bar", "line", "histogram", "scatter"] = "line",
) -> Plotly:
    """Create a combination of Plotly visualizations for a given input data container.

    Inputs
    ------
    primary_trace : OrderedPair|DataFrame|Matrix|Vector
        the DataContainer to be visualized as the first figure

    secondary_trace : OrderedPair|DataFrame|Matrix|Vector
        the DataContainer to be visualized as the second figure

    Parameters
    ----------
    first_figure : 'bar' | 'line' | 'histogram' | 'scatter'
        plotly type to display as the first figure, default is 'scatter'
    second_figure : 'bar' | 'line' | 'histogram' | 'scatter'
        plotly type to display as the second figure, default is 'line'

    Returns
    -------
    Plotly
        the DataContainer containing Plotly visualization of both figures
    """

    layout = plot_layout(title="COMPOSITE")
    fig = go.Figure(layout=layout)
    match_figure(fig, first_figure, primary_trace)
    match_figure(fig, second_figure, secondary_trace)

    fig.update_layout(dict(autosize=True, height=None, width=None))
    return Plotly(fig=fig)


def match_figure(
    fig: go.Figure,
    figure_type: Literal["bar", "line", "histogram", "scatter"],
    dc: OrderedPair | Matrix | DataFrame | Vector,
):
    match figure_type:
        case "bar":
            add_bar_trace(fig, dc)
        case "histogram":
            add_histogram_trace(fig, dc)
        case "line":
            add_line_trace(fig, dc)
        case "scatter":
            add_scatter_trace(fig, dc)


def add_bar_trace(fig: go.Figure, dc: OrderedPair | Matrix | DataFrame | Vector):
    match dc:
        case DataFrame():
            df = dc.m
            first_col = df.iloc[:, 0]
            is_timeseries = False
            if is_timeseries:
                for col in df.columns:
                    if col != df.columns[0]:
                        fig.add_trace(go.Bar(y=df[col].values, x=first_col, name=col))
                fig.update_layout(xaxis_title=df.columns[0])
            else:
                for col in df.columns:
                    if df[col].dtype == "object":
                        counts = df[col].value_counts()
                        fig.add_trace(
                            go.Bar(
                                x=counts.index.tolist(),
                                y=counts.tolist(),
                                name=col,
                            )
                        )
                    else:
                        fig.add_trace(go.Bar(x=df.index, y=df[col], name=col))
                fig.update_layout(xaxis_title="DF index", yaxis_title="Y Axis")
        case OrderedPair():
            x = dc.x
            if isinstance(dc.x, dict):
                dict_keys = list(dc.x.keys())
                x = dc.x[dict_keys[0]]
            y = dc.y
            fig.add_trace(go.Bar(x=x, y=y))
        case Matrix():
            m = dc.m
            num_rows, num_cols = m.shape
            x_ticks = np.arange(num_cols)

            for i in range(num_rows):
                fig.add_trace(go.Bar(x=x_ticks, y=m[i, :], name=f"Row {i+1}"))
            fig.update_layout(xaxis_title="Column", yaxis_title="Value")
        case Vector():
            y = dc.v
            x = np.arange(len(y))
            fig.add_trace(go.Bar(x=x, y=y))


def add_histogram_trace(fig: go.Figure, dc: OrderedPair | Matrix | DataFrame | Vector):
    match dc:
        case DataFrame():
            df = dc.m
            for col in df.columns:
                fig.add_trace(go.Histogram(x=df[col], name=col))
            fig.update_layout(xaxis_title="Value", yaxis_title="Frequency")
        case OrderedPair():
            y = dc.y
            fig.add_trace(go.Histogram(x=y))
        case Matrix():
            m = dc.m
            histogram_trace = go.Histogram(x=m.flatten())
            fig.add_trace(histogram_trace)
        case Vector():
            y = dc.v
            fig.add_trace(go.Histogram(x=y))


def add_line_trace(fig: go.Figure, dc: OrderedPair | Matrix | DataFrame | Vector):
    match dc:
        case DataFrame():
            df = dc.m
            first_col = df.iloc[:, 0]
            is_timeseries = False
            if pd.api.types.is_datetime64_any_dtype(first_col):
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
        case OrderedPair():
            x = dc.x
            if isinstance(dc.x, dict):
                dict_keys = list(dc.x.keys())
                x = dc.x[dict_keys[0]]
            y = dc.y
            fig.add_trace(go.Scatter(x=x, y=y, mode="lines"))
        case Matrix():
            m = dc.m
            num_rows, num_cols = m.shape
            x_ticks = np.arange(num_cols)
            for i in range(num_rows):
                fig.add_trace(
                    go.Scatter(x=x_ticks, y=m[i, :], name=f"Row {i+1}", mode="lines")
                )
            fig.update_layout(xaxis_title="Column", yaxis_title="Value")
        case Vector():
            y = dc.v
            x = np.arange(len(y))
            fig.add_trace(go.Scatter(x=x, y=y, mode="lines"))


def add_scatter_trace(fig: go.Figure, dc: OrderedPair | Matrix | DataFrame | Vector):
    match dc:
        case OrderedPair():
            x = dc.x
            if isinstance(dc.x, dict):
                dict_keys = list(dc.x.keys())
                x = dc.x[dict_keys[0]]
            y = dc.y
            fig.add_trace(go.Scatter(x=x, y=y, mode="markers", marker=dict(size=4)))
        case DataFrame():
            df = dc.m
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
            m = dc.m
            num_rows, num_cols = m.shape
            x_ticks = np.arange(num_cols)
            for i in range(num_rows):
                fig.add_trace(
                    go.Scatter(x=x_ticks, y=m[i, :], name=f"Row {i+1}", mode="markers")
                )

            fig.update_layout(xaxis_title="Column", yaxis_title="Value")
        case Vector():
            y = dc.v
            x = np.arange(len(y))
            fig.add_trace(go.Scatter(x=x, y=y, mode="markers", marker=dict(size=4)))
