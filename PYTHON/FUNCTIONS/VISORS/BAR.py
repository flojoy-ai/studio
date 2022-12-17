from joyflo import flojoy
from .template import init_template

@flojoy
def BAR(v, params):
    print(v)
    fig = dict(
        data = [dict(x = list(v[0].x), y = list(v[0].y), type='bar')],
        layout = dict(template = init_template())
    )
    return fig