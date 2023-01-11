import numpy as np
from joyflo import flojoy,DataContainer

@flojoy
def LOOP(v,params):

    print("EXECUTING LOOP")

    print(v)

    if len(v) == 0 or np.any(v[0].y) == None:
        x = list()
        for i in range(1000):
            x.append(i)
        y = np.full(1000, 1)

        return DataContainer(x=x,y=y)

    x = v[0].x
    y = v[0].y



    if x is None:
        x = np.full(len(y),1)

    return DataContainer(x=x,y=y)