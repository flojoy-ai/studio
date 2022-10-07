import numpy as np
import traceback
from joyflo import flojoy, VectorXY

@flojoy
def LINSPACE(v, params):
    x = np.linspace(params['start'], params['end'], params['steps'])

    return VectorXY(x = x, y = None)