from .VCTR import get_input_vectors
from .template import init_template

def SCATTER(**kwargs):
    previous_job_results = get_input_vectors(kwargs['previous_job_ids'])
    payload = previous_job_results[0]

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