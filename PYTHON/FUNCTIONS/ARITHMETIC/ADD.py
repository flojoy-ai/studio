import numpy as np
from flojoy import flojoy, DataContainer

@flojoy
def ADD(v, params):
    ''' Add 2 input vectors and return the result '''
    # print(' v in add node: ', v)
    a = [0]
    b = [0]

    if len(v) == 2:
        a = v[0].y
        b = v[1]['y']

    y = np.add(a, b)

    return DataContainer(x = {'a': a, 'b': b}, y = y)