import numpy as np
import plotly.graph_objects as go  # type:ignore
from flojoy import DataFrame, Matrix, OrderedTriple, Plotly, Surface, flojoy
from blocks.DATA.VISUALIZATION.template import plot_layout


@flojoy
def SURFACE3D(default: OrderedTriple | DataFrame | Surface | Matrix) -> Plotly:
    """Create a Plotly 3D Surface visualization for a given input DataContainer.

    Parameters
    ----------
    default : OrderedTriple|DataFrame|Surface|Matrix
        the DataContainer to be visualized

    Returns
    -------
    Plotly
        the DataContainer containing the Plotly 3D Surface visualization

    """

    layout = plot_layout(title="SURFACE3D")

    match default:
        case OrderedTriple():
            x = np.unique(default.x)
            y = np.unique(default.y)

            z_size = len(x) * len(y)

            # Truncate or pad the z array to match the desired size
            if z_size > len(default.z):
                z = np.pad(
                    default.z, (0, z_size - len(default.z)), mode="constant"
                ).reshape(len(y), len(x))
            else:
                z = default.z[:z_size].reshape(len(y), len(x))

            X, Y = np.meshgrid(x, y)
            if z.ndim < 2:
                num_columns = len(z) // 2
                z = np.reshape(z, (2, num_columns))
            fig = go.Figure(
                data=[go.Surface(x=X, y=Y, z=z)],
                layout=layout,
            )
        case Surface():
            x = default.x
            y = default.y
            z = default.z
            fig = go.Figure(data=[go.Surface(x=x, y=y, z=z)], layout=layout)
        case Matrix():
            m = default.m
            if m.ndim < 2:
                num_columns = len(m) // 2
                m = np.reshape(m, (2, num_columns))
            fig = go.Figure(data=[go.Surface(z=m)], layout=layout)
        case DataFrame():
            df = default.m
            fig = go.Figure(data=[go.Surface(z=df.values)], layout=layout)

    return Plotly(fig=fig)
