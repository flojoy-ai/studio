import numpy as np
from .VCTR import fetch_inputs

import os

from redis import Redis
from rq.job import Job

REDIS_HOST = os.environ.get('REDIS_HOST', 'localhost')
REDIS_PORT = os.environ.get('REDIS_PORT', 6379)

def CONDITIONAL(**kwargs):
    ''' Add 2 input vectors and return the result '''
    previous_job_ids = kwargs['previous_job_ids']
    previous_job_results = fetch_inputs(previous_job_ids)

    '''
        Checking if it's a part of a LOOP
    '''

    is_part_of_loop = None
    direction = True
    return_job = None

    for prev_job_id in previous_job_ids:
        job = Job.fetch(prev_job_id, connection=Redis(host=REDIS_HOST, port=REDIS_PORT))

        if "flow_control_value" in job.kwargs['ctrls']:
            current_iteration_value = job.kwargs['ctrls']['flow_control_value']['initial_value']
            number_of_iterations = job.kwargs['ctrls']['flow_control_value']["numder_of_iterations"]

            print(current_iteration_value)
            print(number_of_iterations)

            if number_of_iterations > current_iteration_value + 1:
                direction = False
            is_part_of_loop = True
        else:
            return_job = job.result

    if is_part_of_loop:
        if direction:
            return {'x0':return_job['x0'],'y0':return_job['y0'],'direction':'true'}
        else:
            return {'direction':'false','x0':return_job['x0'],'y0':return_job['y0']}

    operator = ""

    if 'ctrls' in kwargs:
        ctrls = kwargs['ctrls']
        for key, input in ctrls.items():
            operator = input['operator']

    print(operator)

    if operator == None:
        raise Exception("OPERATOR NULL")
    else:
        if operator == 'IS_GREATER_THAN':
            return {'x0':previous_job_results[0]['x0'],'y0':previous_job_results[0]['y0'],'direction':'false'}

            '''
            if len(previous_job_result) == 2:
                pass
            elif len(previous_job_result) == 1:
                pass
            else:
                raise Exception("Only Two Input at a time is acceptable")
            '''