from .VCTR import fetch_inputs
from .template import init_template

def LINE(**kwargs):
    previous_job_results = fetch_inputs(kwargs['previous_job_ids'])
    payload = previous_job_results[0]

    fig = dict(
        data = [dict(
            x = list(payload['x0']),
            y = list(payload['y0']),
            type='scatter',
            mode='lines'
        )],
        layout = dict(template = init_template())
    )
    return fig