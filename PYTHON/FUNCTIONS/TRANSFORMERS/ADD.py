import numpy as np
from joyflo import flojoy, VectorXY

@flojoy
def ADD(v, params):
    ''' Add 2 input vectors and return the result '''
    a = [0]
    b = [0]

    if len(v) == 2:
        a = v[0].y
        b = v[1]['y']

    y = np.add(a, b)

    return VectorXY(x = [a, b], y = y)