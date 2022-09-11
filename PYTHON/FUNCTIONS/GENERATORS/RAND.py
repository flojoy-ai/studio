import numpy as np
from .VCTR import fetch_inputs
import json
import traceback

def RAND(**kwargs):
    try:
        print('~ RAND ~')
        print(json.dumps(kwargs))
        print('PID', kwargs['previous_job_ids'])

        previous_job_results = fetch_inputs(kwargs['previous_job_ids'])

        xy0 = previous_job_results[0]

        x = xy0['x0']

        y = np.random.normal(size=len(x))
    except Exception:
        print(traceback.format_exc())
    
    return {'x0':x, 'y0':y}
