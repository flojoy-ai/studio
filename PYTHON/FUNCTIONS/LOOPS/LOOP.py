import numpy as np
from flojoy import flojoy, DataContainer, JobResultBuilder


@flojoy
def LOOP(v, params):
    print("EXECUTING LOOP, params:", params)
    if len(v) == 0 or np.any(v[0].y) == None:
        x = list()
        for i in range(1000):
            x.append(i)
        y = np.full(1000, 1)

        data = DataContainer(x=x, y=y)
    else:
        x = v[0].x
        y = v[0].y

        if x is None:
            x = np.full(len(y), 1)

        data = DataContainer(x=x, y=y)

    return JobResultBuilder().from_data(data).flow_to_directions(['body']).build()