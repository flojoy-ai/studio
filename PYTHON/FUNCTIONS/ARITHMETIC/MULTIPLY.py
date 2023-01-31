import numpy as np
from flojoy import flojoy, DataContainer


@flojoy
def MULTIPLY(v, params):
    ''' Takes 2 input vectors, multiplies them, and returns the result '''
    a = v[0].y
    b = v[1].y
    y = np.multiply(a, b)
    return DataContainer(x=[a, b], y=y)
