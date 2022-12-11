from joyflo import flojoy
from .template import init_template

@flojoy
def HISTOGRAM(v, params):

    fig = dict(
        data = [dict(
            x = list(v[0].x),
            type='histogram'
        )],
        layout = dict(template = init_template())
    )
    return fig