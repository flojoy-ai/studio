import numpy as np
from joyflo import flojoy, VectorXY

def CONSTANT(v, params):
    print('running constant in python program...',)
    # ''' Generates a single x-y vector of numeric (floating point) constants'''

    if v.__len__() > 0:
        x = v[0].x
        y = np.full(len(x), float(params['constant']))
        return {'x0':x, 'y0':y}
    x = list()
    for i in range(1000):
        x.append(i)
    y = np.full(1000, float(params['constant']))
    
    return VectorXY(x = x, y = y)
