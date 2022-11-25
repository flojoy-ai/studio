import numpy as np
from .VCTR import fetch_inputs

from redis import Redis
from rq.job import Job
import os

REDIS_HOST = os.environ.get('REDIS_HOST', 'localhost')
REDIS_PORT = os.environ.get('REDIS_PORT', 6379)


def LOOP(**kwargs):

    if "previous_job_ids" in kwargs:

        '''
            Checking if there's a conditional node with previous iteration output
        '''

        previous_job_ids = kwargs['previous_job_ids']

        conditional_job_result = None
        for prev_id in previous_job_ids:
            job = Job.fetch(prev_id, connection=Redis(host=REDIS_HOST, port=REDIS_PORT))
            if "CONDITIONAL_OPERATOR" in job.kwargs['ctrls']:
                conditional_job_result = job.result
                break

        if conditional_job_result is not None:
            print(conditional_job_result)
            return {'x0':conditional_job_result['x0'],'y0':conditional_job_result['y0']}

        previous_job_ids = kwargs['previous_job_ids']
        previous_job_results = fetch_inputs(previous_job_ids)


    return {'x0':[1,2,3],'y0':[2,3,4]} # returning random value