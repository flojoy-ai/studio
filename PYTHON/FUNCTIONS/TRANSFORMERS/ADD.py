import numpy as np
from joyflo import flojoy, DataContainer

@flojoy
def ADD(v, params):
    ''' Add 2 input vectors and return the result '''
    x0 = [0]
    x1 = [0]

    print('Add - v:', v)
    
    if len(v) == 2:
        x0 = v[0].y
        x1 = v[1].y
        
    y = np.add(x0, x1)

    return DataContainer(x = [a, b], y = y)