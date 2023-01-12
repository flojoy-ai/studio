from flojoy import flojoy,DataContainer
import time

@flojoy
def TIMER(v,params):
    print("executing timer")

    seconds = int(params['sleep_time'])
    time.sleep(seconds)

    if len(v) == 0:
        return DataContainer(x=None,y=None)


    return DataContainer(x=v[0].x,y=v[0].y)