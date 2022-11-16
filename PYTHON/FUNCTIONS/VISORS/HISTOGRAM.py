from .VCTR import fetch_inputs
from .template import init_template

def HISTOGRAM(**kwargs):

    if 'previous_job_ids' in kwargs:
        previous_job_ids = kwargs['previous_job_ids']

        previous_job_results = fetch_inputs(previous_job_ids)
        payload = previous_job_results[0]

    fig = dict(
        data = [dict(
            x = list(payload['x0']),
            type='histogram',
        )],
        layout = dict(template = init_template())
    )
    return fig