import numpy as np
import traceback

def LINSPACE(**kwargs):    
    try:
        if 'ctrls' not in kwargs:
            ctrls = dict(start=-10, end=10, steps=10)
        elif 'start' not in kwargs['ctrls'].keys():
            ctrls = dict(start=-10, end=10, steps=10)
        else:
            ctrls = kwargs['ctrls']
        print(ctrls)
        x = np.linspace(ctrls['start'], ctrls['end'], ctrls['steps'])
    except Exception:
        print(traceback.format_exc())
    return {'x0': x}