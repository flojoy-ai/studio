import numpy as np
from joyflo import flojoy, DataContainer
import traceback


@flojoy
def RAND(v, params):
    x = None
    if len(v) > 0:
        x = v[0].y
        # For now return fixed value for y key
        # Later on, A env variable will be used to return fixed value for testing
        y = x
        # y = np.random.normal(size=len(x))
    else:
        y = np.random.normal(size=1000)

    return DataContainer(x=x, y=y)
