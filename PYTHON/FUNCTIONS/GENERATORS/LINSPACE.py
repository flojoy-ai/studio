import numpy as np
from joyflo.flojoy_python import flojoy, VectorXY

@flojoy
def LINSPACE(v, params):
    print("LINSPACE IS RUNNING!!!")

    x = np.linspace(params['start'], params['end'], params['steps'])

    return VectorXY(x = x, y = None)