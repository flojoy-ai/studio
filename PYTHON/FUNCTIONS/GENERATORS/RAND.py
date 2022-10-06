import numpy as np
from joyflo import flojoy
import json
import traceback

@flojoy
def RAND(node_inputs, params):
    try:
        print('~ RAND ~')
        print(json.dumps(params))

        xy0 = node_inputs[0]

        x = xy0['x0']

        y = np.random.normal(size=len(x))
    except Exception:
        print(traceback.format_exc())
    
    return {'x0':x, 'y0':y}
