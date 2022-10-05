import numpy as np
import traceback
from .flojoy import flojoy

@flojoy
def LINSPACE(node_inputs, params):
    x = np.linspace(params['start'], params['end'], params['steps'])

    return {'x0': x}