import numpy as np
import traceback
from .VCTR import fetch_inputs


def LINSPACE(**kwargs):
    params = {
        'start': 10,
        'end': 0,
        'steps': 1000,
    }
    if 'ctrls' in kwargs:
        ctrls = kwargs['ctrls']
        for key, input in ctrls.items():
            paramName = input['param']
            if paramName in params:
                params[paramName] = input['value']

    x = np.linspace(params['start'], params['end'], params['steps'])

    return {'x0': x}
  
        # if 'ctrls' not in kwargs:
        #     ctrls = dict(start=-10, end=10, steps=1000)
        # elif 'start' not in kwargs['ctrls'].keys():
        #     ctrls = dict(start=-10, end=10, steps=1000)
        # else:
        #     ctrls = kwargs['ctrls']
    # except Exception:
    #     print(traceback.format_exc())