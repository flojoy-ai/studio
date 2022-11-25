import numpy as np
from .VCTR import fetch_inputs

from redis import Redis
from rq.job import Job
import os

REDIS_HOST = os.environ.get('REDIS_HOST', 'localhost')
REDIS_PORT = os.environ.get('REDIS_PORT', 6379)


def LOOP(**kwargs):
    ''' Add 2 input vectors and return the result '''
    if "prev_iteration_job" in kwargs:
        prev_iteration_job_id = kwargs['prev_iteration_job']
        job = Job.fetch(prev_iteration_job_id, connection=Redis(host=REDIS_HOST, port=REDIS_PORT))
        previous_job_results = job.result

        print(previous_job_results)

        return {'x0':previous_job_results['x0'],'y0':previous_job_results['y0']}

    else:
        if "previous_job_ids" in kwargs:
            previous_job_ids = kwargs['previous_job_ids']
            previous_job_results = fetch_inputs(previous_job_ids)

    return {'x0':[1,2,3],'y0':[2,3,4]}