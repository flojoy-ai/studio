import numpy as np
from flojoy import flojoy, DataContainer


@flojoy
def MULTIPLY(v, params):
    ''' Multiply 2 input vectors and return the result '''
    a = [0]
    b = [0]

    if len(v) == 2:
        a = v[0].y
        b = v[1]['y']

    y = np.multiply(a, b)

    return DataContainer(x={'a': a, 'b': b}, y=y)
