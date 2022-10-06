from joyflo import flojoy
from .template import init_template

@flojoy
def SCATTER3D(node_inputs, params):
    payload = node_inputs[0]

    fig = dict(
        data = [dict(
            x = list(payload['x0']),
            y = list(payload['y0']),
            z = list(payload['z0']) if 'z0' in payload else list([0] * len(payload['x0'])),
            type='scatter3d',
            mode='markers'
        )],
        layout = dict(template = init_template())
    )
    return fig