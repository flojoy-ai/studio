from joyflo import flojoy
from .template import init_template

@flojoy
def SURFACE3D(node_inputs, params):
    node_inputs = fetch_inputs(kwargs['previous_job_ids'])
    payload = node_inputs[0]

    fig = dict(
        data = [dict(
            x = list(payload['x0']),
            y = list(payload['y0']),
            z = list(payload['z0']) if 'z0' in payload else list([0] * len(payload['y0'])),
            type='surface'
        )],
        layout = dict(template = init_template())
    )
    return fig