import numpy as np
from joyflo import flojoy, VectorXY
import json
import traceback

@flojoy
def RAND(v, params):
    try:
        print('~ RAND ~')
        print(json.dumps(params))

        x = v[0].x

        y = np.random.normal(size=len(x))
    except Exception:
        print(traceback.format_exc())
    
    return VectorXY(x = x, y = y)
