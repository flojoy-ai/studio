import numpy as np
from .VCTR import fetch_inputs

def CONDITIONAL(**kwargs):
    ''' Add 2 input vectors and return the result '''
    previous_job_result = kwargs['previous_job_ids']
    previous_job_result = fetch_inputs(previous_job_ids)

    print('JOB RESULT 1', previous_job_result[0])
    print('JOB RESULT 2', previous_job_result[1])

    operator = kwargs['ctrls']['CONDITIONAL_OPERATOR']['OPERATOR']
    if operator == null:
        raise Exception("OPERATOR NULL")
    else:
        if operator == 'IS_GREATER_THAN':


            if len(previous_job_result) == 2:
                pass
            elif len(previous_job_result) == 1:
                pass
            else:
                raise Exception("Only Two Input at a time is acceptable")