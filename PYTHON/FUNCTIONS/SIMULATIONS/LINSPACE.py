import numpy as np
from flojoy import flojoy, DataContainer

@flojoy
def LINSPACE(v, params):
    x = None
    if v.__len__() > 0:
        x = v[0].y
    y = np.linspace(float(params['start']), float(params['end']), int(params['step']))
    result = DataContainer(x = x, y = y)
    return result