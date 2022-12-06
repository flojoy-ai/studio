import numpy as np
from joyflo import flojoy, VectorXY

@flojoy
def MULTIPLY(v, params):
    ''' Takes 2 input vectors, multiplies them, and returns the result '''

    x0 = v[0].y
    x1 = v[1].y

    y = np.multiply(x0, x1)

    return VectorXY(x = [x0, x1], y = y)