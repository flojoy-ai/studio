import numpy as np
from .VCTR import fetch_inputs

def ADD(**kwargs):
    ''' Add 2 input vectors and return the result '''
    y2 = [0]
    print("Enqueing ADD functions")

    previous_job_results = fetch_inputs(kwargs['previous_job_ids'])

    x = previous_job_results[0]['x0']
    if len(previous_job_results) == 2:
        y2 = previous_job_results[1]['y0']
    y = np.add(
        previous_job_results[0]['y0'],
        y2)

    print(y)
    return {'x0':x, 'y0':y}