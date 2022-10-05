import numpy as np
from .flojoy import flojoy

def CONSTANT(node_inputs, params):
    print('running constant in python program...',)
    # ''' Generates a single x-y vector of numeric (floating point) constants'''

    for key, input in ctrls.items():
        paramName = input['param']
        if paramName in params:
                params[paramName] = input['value']
    if node_inputs.__len__() > 0:
        xy0 = node_inputs[0]
        x = xy0['x0']
        y = np.full(len(x), float(params['constant']))
        return {'x0':x, 'y0':y}
    x = list()
    for i in range(1000):
        x.append(i)
    y = np.full(1000, float(params['constant']))
    return {'x0': x,'y0':y}
