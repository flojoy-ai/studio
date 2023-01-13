from flojoy import flojoy
from .template import init_template

@flojoy
def SCATTER3D(v, params):

    fig = dict(
        data = [dict(
            x = list(v[0].x),
            y = list(v[0].y),
            z =  list([0] * len(v[0].x)),
            type='scatter3d',
            mode='markers'
        )],
        layout = dict(template = init_template())
    )
    # list(v[0].z) if v[0].z is not None else
    return fig