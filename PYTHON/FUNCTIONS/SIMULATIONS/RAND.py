import numpy as np
from flojoy import flojoy, DataContainer
import traceback


@flojoy
def RAND(v, params):
    try:
        x = v[0].y
        # y = x
        y = x if x is not None else np.full(
            2, 2)  # np.random.normal(size=len(x))
    except Exception:
        print(traceback.format_exc())

    return DataContainer(x=x, y=y)
