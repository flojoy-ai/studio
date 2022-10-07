from joyflo import flojoy
from .template import init_template

@flojoy
def SCATTER(v, params):

    fig = dict(
        data = [dict(
            x = list(v[0].x),
            y = list(v[0].y),
            type='scatter',
            mode='markers'
        )],
        layout = dict(template = init_template())
    )
    return fig