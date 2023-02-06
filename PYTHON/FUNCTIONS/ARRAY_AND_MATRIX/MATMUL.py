import numpy as np
from flojoy import flojoy, DataContainer

@flojoy
def MATMUL(v, params):
    ''' Takes 2 input matrices, multiplies them, and returns the result '''
    a = np.eye(3)
    b = np.eye(3)
    if len(v) == 2:
        a = v[0].y
        b = v[1]['y']
    return DataContainer(type='matrix', m=np.matmul(a, b))