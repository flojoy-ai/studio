from flojoy import flojoy, DataContainer
import time
import numpy as np


@flojoy
def TIMER(v, params):

    seconds = int(params['sleep_time'])
    time.sleep(seconds)

    if len(v) == 0:
        y = np.full(1000, seconds)
        return DataContainer(x=None, y=y)

    return DataContainer(x=v[0].x, y=v[0].y)
