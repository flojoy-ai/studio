import numpy as np
from joyflo import flojoy, VectorXY
import traceback

@flojoy
def RAND(v, params):
    try:
        print(v)
        x = v[0].y
        y = x
        # y = np.random.normal(size=len(x))
    except Exception:
        print(traceback.format_exc())

    return VectorXY(x = x, y = y)
