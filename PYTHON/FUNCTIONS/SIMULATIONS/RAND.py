import numpy as np
from flojoy import flojoy, DataContainer
import traceback

@flojoy
def RAND(v, params):
    x = None
    if len(v) > 0:
        x = v[0].y
        y = np.random.normal(size=len(x))
    else:
        y = np.random.normal(size=1000)

    return DataContainer(x=x, y=y)


@flojoy
def RAND_MOCK(v, params):
    print('running mock version of rand')
    x = None
    if len(v) > 0:
        x = v[0].y
        y = x
    else:
        y = np.full(1000, 1000) # for reproducibility returning an array with constant values
    return DataContainer(x=x, y=y)