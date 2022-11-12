from .VCTR import fetch_inputs
from .template import init_template

def HISTOGRAM(**kwargs):

    if 'previous_job_ids' in kwargs:
        previous_job_ids = kwargs['previous_job_ids']
        if len(previous_job_ids) >0:
            previous_job_results = fetch_inputs(kwargs['previous_job_ids'])
            payload = previous_job_results[0]
    if 'special_type_node_result' in kwargs:
        special_type_node_result = kwargs['special_type_node_result']
        if special_type_node_result is not None:
            payload = kwargs['special_type_node_result']

    fig = dict(
        data = [dict(
            x = list(payload['x0']),
            type='histogram',
        )],
        layout = dict(template = init_template())
    )
    return fig