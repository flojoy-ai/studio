import numpy as np
from .VCTR import get_input_vectors

def SINE(**kwargs):
    previous_job_results = get_input_vectors(kwargs['previous_job_ids'])

    xy0 = previous_job_results[0]

    x = xy0['x0']
    y = np.sin(x)
    
    return {'x0':x, 'y0':y}
