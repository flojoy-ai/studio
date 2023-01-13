from flojoy import flojoy, DataContainer
import time
import numpy as np


@flojoy
def TIMER(v, params):
    print("executing timer")

    seconds = int(params['sleep_time'])
    time.sleep(seconds)
    y = np.full(1000, seconds)
    if len(v) == 0:
        return DataContainer(x=None, y=y)

    return DataContainer(x=v[0].y, y=y)
