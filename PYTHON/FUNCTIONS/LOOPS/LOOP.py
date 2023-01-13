import numpy as np
from flojoy import flojoy, DataContainer


@flojoy
def LOOP(v, params):
    print(' loop params: ', params)
    iteration_count = int(params['iteration_count']) if 'iteration_count' in params else 1
    x = list()
    for i in range(1000):
        x.append(i)
    y = np.full(1000, iteration_count)
    # print('v in loop:', v)
    if len(v) == 0 or np.any(v[0].y) == None:
        return DataContainer(x=x, y=y)

    x = v[0].y
    y = np.full(len(x), iteration_count)
    return DataContainer(x=x, y=y)
