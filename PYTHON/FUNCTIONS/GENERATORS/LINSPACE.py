import numpy as np
from joyflo import flojoy, VectorXY

@flojoy
def LINSPACE(v, params):
    x = None
    if v.__len__() > 0:
        x = v[0].y
    y = np.linspace(int(params['start']), int(params['end']), int(params['step']))
    result = VectorXY(x = x, y = y)
    return result