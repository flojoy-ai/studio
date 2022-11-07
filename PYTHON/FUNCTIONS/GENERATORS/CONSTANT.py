import numpy as np
from .VCTR import fetch_inputs

def CONSTANT(**kwargs):
    print('running constant in python program...',)
    # ''' Generates a single x-y vector of numeric (floating point) constants'''
    params = {
        'constant': 2
    }
    previous_job_results = list()

    if 'previous_job_ids' in kwargs:
        previous_job_results = fetch_inputs(kwargs['previous_job_ids'])
    
    if 'ctrls' in kwargs:
        ctrls = kwargs['ctrls']
    else:
        ctrls = {}

    for key, input in ctrls.items():
        paramName = input['param']
        if paramName in params:
            params[paramName] = input['value']

    if previous_job_results.__len__() > 0:
        xy0 = previous_job_results[0]
        x = xy0['x0']
        y = np.full(len(x), float(params['constant']))
        return {'x0':x, 'y0':y}
        
    x = list()
    for i in range(1000):
        x.append(i)
    y = np.full(1000, float(params['constant']))
    return {'x0': x,'y0':y}
