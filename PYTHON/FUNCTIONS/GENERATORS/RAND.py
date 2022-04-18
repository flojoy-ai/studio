import numpy as np
from .VCTR import fetch_inputs

def RAND(**kwargs):
    previous_job_results = fetch_inputs(kwargs['previous_job_ids'])

    xy0 = previous_job_results[0]

    x = xy0['x0']

    y = np.random.normal(size=len(x))
    
    return {'x0':x, 'y0':y}
