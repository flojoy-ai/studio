import numpy as np
from joyflo import flojoy, VectorXY

@flojoy
def MULTIPLY(v, params):
    ''' Takes 2 input vectors, multiplies them, and returns the result '''

    a = v[0].y
    b = v[1].y

    y = np.multiply(a, b)

    return VectorXY(x = [a, b], y = y)