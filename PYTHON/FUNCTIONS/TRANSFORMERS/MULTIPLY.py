import numpy as np
from joyflo import flojoy, VectorXY

@flojoy
def MULTIPLY(v, params):
    ''' Takes 2 input vectors, multiplies them, and returns the result '''

    print('MULTIPLY started with params', params)

    x = v[0].x

    y = np.multiply(v[0].y, v[1].y)

    return VectorXY(x = x, y = y)