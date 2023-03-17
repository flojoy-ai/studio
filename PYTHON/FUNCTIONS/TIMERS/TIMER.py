from flojoy import flojoy,DataContainer, JobResultBuilder
import time

@flojoy
def TIMER(v,params):
    print("executing timer")
    
    seconds = int(params['sleep_time'])
    time.sleep(seconds)
    
    return JobResultBuilder() \
        .from_inputs(v) \
        .build()