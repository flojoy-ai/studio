from joyflo import flojoy
from .template import init_template

@flojoy
def HISTOGRAM(**kwargs):
    previous_job_results = fetch_inputs(kwargs['previous_job_ids'])
    payload = previous_job_results[0]

    fig = dict(
        data = [dict(
            x = list(payload['x0']),
            type='histogram',
        )],
        layout = dict(template = init_template())
    )
    return fig