import numpy as np
from joyflo import flojoy, VectorXY

@flojoy
def LINSPACE(v, params):
    x = np.linspace(int(params['start']), int(params['end']), int(params['step']))
    result = VectorXY(x = x, y = None)
    return result