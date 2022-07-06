import numpy as np
from .VCTR import fetch_inputs

def SINE(**kwargs):
    previous_job_results = fetch_inputs(kwargs['previous_job_ids'])

    params = {
        'frequency': 1,
        'offset': 0,
        'amplitude': 1,
    }

    if 'ctrls' in kwargs:
        ctrls = kwargs['ctrls']
        for key, input in ctrls.items():
            paramName = input['param']
            if paramName in params:
                params[paramName] = input['value']

    xy0 = previous_job_results[0]

    x = xy0['x0']
    y = params['amplitude'] * np.sin(x * params['frequency']) + params['offset']

    return {'x0':x, 'y0':y}
