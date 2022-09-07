import numpy as np
from .VCTR import fetch_inputs

def CONSTANT(**kwargs):
    print('running constant in python program...')
    # ''' Generates a single x-y vector of numeric (floating point) constants'''
    params = {
        'constant': 2
    }
    previous_job_results = fetch_inputs(kwargs['previous_job_ids'])

    # ctrls = kwargs['ctrls'] if 'ctrls' in kwargs else dict(constant=3)

    if 'ctrls' in kwargs:
        ctrls = kwargs['ctrls']
    for key, input in ctrls.items():
        paramName = input['param']
        if paramName in params:
                params[paramName] = input['value']
    xy0 = previous_job_results[0]

    x = xy0['x0']
    y = np.full(len(x), float(params['constant']))
    print(y)
    print('Y result printed above')
    return {'x0':x, 'y0':y}