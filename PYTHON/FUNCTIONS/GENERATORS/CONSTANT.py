import numpy as np
from .VCTR import get_input_vectors

def CONSTANT(**kwargs):
    ''' Generates a single x-y vector of numeric (floating point) constants'''

    previous_job_results = get_input_vectors(kwargs['previous_job_ids'])

    ctrls = kwargs['ctrls'] if 'ctrls' in kwargs else dict(constant=3)

    xy0 = previous_job_results[0]

    x = xy0['x0']
    y = np.full(len(x), float(ctrls['constant']))

    return {'x0':x, 'y0':y}