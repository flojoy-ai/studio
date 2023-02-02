from flojoy import flojoy
from ..VISORS.template import init_template

@flojoy
def IMAGE(v, params):

    fig = dict(
        data = [dict(
            y = list(v[0].y[0]),
            type='image'
        )],
        layout = dict(template = init_template())
    )
    return fig