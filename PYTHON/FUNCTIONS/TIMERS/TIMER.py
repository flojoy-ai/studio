from joyflo import flojoy,DataContainer
import time

@flojoy
def TIMER(v,params):
    print("executing timer")

    if len(v) == 0:
        return DataContainer(x=None,y=None)

    seconds = int(params['sleep_time'])
    time.sleep(seconds)

    return DataContainer(x=v[0].x,y=v[0].y)