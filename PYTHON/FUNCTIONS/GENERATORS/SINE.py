import numpy as np
from .VCTR import fetch_inputs

def SINE(**kwargs):
    previous_job_results = fetch_inputs(kwargs['previous_job_ids'])
    print('kwargs: ', kwargs)

    xy0 = previous_job_results[0]

    x = xy0['x0']
    y = np.sin(x)
    
    return {'x0':x, 'y0':y}
