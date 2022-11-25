import numpy as np
from joyflo import flojoy, VectorXY
import traceback

@flojoy
def RAND(v, params):
    try:
        rng = np.random.default_rng(123)
        x = v[0].y
        y = rng.standard_normal(size=len(x))
    except Exception:
        print(traceback.format_exc())
    
    return VectorXY(x = x, y = y)
