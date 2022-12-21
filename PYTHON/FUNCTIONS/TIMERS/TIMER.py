from joyflo import flojoy,VectorXY
import time

@flojoy
def TIMER(v,params):
    print("executing timer")
    seconds = params['seconds']
    time.sleep(seconds)

    return v