import numpy as np
# from functools import wraps
from joyflo import flojoy, VectorXY
# from joyflo import VectorXY


# def flojoy(func):
#     @wraps(func)
#     def inner(previous_job_ids, mock):
#         print("DECORATOR IS WORKING!!!")
#         func()
    
#     return inner

@flojoy
def LINSPACE(v, params):
    print("LINSPACE IS RUNNING!!!")

    x = np.linspace(int(params['start']), int(params['end']), int(params['step']))
    # x = np.linspace(0,100,1)

    return VectorXY(x = x, y = None)