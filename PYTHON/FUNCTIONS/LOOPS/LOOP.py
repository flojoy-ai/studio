import numpy as np
from .VCTR import fetch_inputs

def LOOP(**kwargs):
    ''' Add 2 input vectors and return the result '''
    print(kwargs)
    if "prev_iteration_job" in kwargs:
        previous_job_results = kwargs['prev_iteration_job'].result
        return {'x0':previous_job_results['x0'],'y0':previous_job_results['y0']}

    else:
        if "previous_job_ids" in kwargs:
            previous_job_ids = kwargs['previous_job_ids']
            previous_job_results = fetch_inputs(previous_job_ids)

    return {'x0':[1,2,3],'y0':[2,3,4]}