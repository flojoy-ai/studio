import numpy as np
from joyflo import flojoy, VectorXY

@flojoy
def ADD(v, params):
    ''' Add 2 input vectors and return the result '''
    y2 = [0]
    
    x = v[0].x
    if len(v) == 2:
        y2 = v[1].y
        
    y = np.add(v[0].y, y2)
    return VectorXY(x = x, y = y)