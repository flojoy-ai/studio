from .flojoy import flojoy
from .template import init_template

@flojoy
def SCATTER(node_inputs, params):
    payload = node_inputs[0]

    fig = dict(
        data = [dict(
            x = list(payload['x0']),
            y = list(payload['y0']),
            type='scatter',
            mode='markers'
        )],
        layout = dict(template = init_template())
    )
    return fig