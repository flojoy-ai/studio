from .VCTR import get_input_vectors
from .template import init_template

def HISTOGRAM(**kwargs):
    previous_job_results = get_input_vectors(kwargs['previous_job_ids'])
    payload = previous_job_results[0]

    fig = dict(
        data = [dict(
            x = list(payload['x0']),
            type='histogram',
        )],
        layout = dict(template = init_template())
    )
    return fig