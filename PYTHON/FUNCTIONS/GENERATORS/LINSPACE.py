import numpy as np
from joyflo import flojoy, VectorXY

@flojoy
def LINSPACE(v, params):
    y = np.linspace(int(params['start']), int(params['end']), int(params['step']))
    result = VectorXY(x = None, y = y)
    return result