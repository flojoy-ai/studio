import numpy as np
from flojoy import flojoy, DataContainer
import traceback

@flojoy
def RAND(v, params):
    try:
        x = v[0].y
        # y = x
        y = np.random.normal(size=len(x))
    except Exception:
        print(traceback.format_exc())

    return DataContainer(x = x, y = y)
