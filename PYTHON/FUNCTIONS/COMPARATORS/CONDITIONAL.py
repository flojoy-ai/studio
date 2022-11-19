import numpy as np
from .VCTR import fetch_inputs

def CONDITIONAL(**kwargs):
    ''' Add 2 input vectors and return the result '''
    previous_job_ids = kwargs['previous_job_ids']
    previous_job_results = fetch_inputs(previous_job_ids)

    operator = ""

    if 'ctrls' in kwargs:
        ctrls = kwargs['ctrls']
        for key, input in ctrls.items():
            operator = input['operator']

    print(operator)

    if operator == None:
        raise Exception("OPERATOR NULL")
    else:
        if operator == 'IS_GREATER_THAN':
            return {'x0':previous_job_results[0]['x0'],'y0':previous_job_results[0]['y0'],'direction':'false'}

            '''
            if len(previous_job_result) == 2:
                pass
            elif len(previous_job_result) == 1:
                pass
            else:
                raise Exception("Only Two Input at a time is acceptable")
            '''