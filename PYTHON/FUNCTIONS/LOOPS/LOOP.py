import numpy as np
from joyflo import flojoy,DataContainer

@flojoy
def LOOP(v,params):
    print("EXECUTING LOOP")

    x = v[0].x
    y = v[0].y

    print(v)

    if x is None:
        x = np.full(len(y),1)

    return DataContainer(x=x,y=y)