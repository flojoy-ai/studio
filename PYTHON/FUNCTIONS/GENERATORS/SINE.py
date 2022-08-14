import numpy as np
from .VCTR import fetch_inputs
from scipy import signal

def SINE(**kwargs):
    previous_job_results = fetch_inputs(kwargs['previous_job_ids'])

    params = {
        'frequency': 1,
        'offset': 0,
        'amplitude': 1,
        'waveform': 'sine'
    }

    if 'ctrls' in kwargs:
        ctrls = kwargs['ctrls']
        for key, input in ctrls.items():
            paramName = input['param']
            if paramName in params:
                params[paramName] = input['value']

    print('params sine:', params)

    xy0 = previous_job_results[0]
    x = xy0['x0']

    waveform = params['waveform']
    A = params['amplitude']
    F = params['frequency']
    Y0 = params['offset']

    print('A:', A)
    print('F:', F)
    print('Y0:', Y0)

    if waveform == 'sine':
        y = Y0 + A * np.sin(np.radians(2 * np.pi * F) * x)
    elif waveform == 'square':
        y = Y0 + A * signal.square(2 * np.pi * F * x / 10)
    elif waveform == 'triangle':
        y = Y0 + A * signal.sawtooth(2 * np.pi * F * x / 10, 0.5)
    elif waveform == 'sawtooth':
        y = Y0 + A * signal.sawtooth(2 * np.pi * F / 10 * x)

    return {'x0':x, 'y0':y}
