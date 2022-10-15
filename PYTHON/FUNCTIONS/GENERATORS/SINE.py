import numpy as np
import pandas as pd
from joyflo import flojoy, VectorXY
from scipy import signal

@flojoy
def SINE(v, params):
    print('SINE v, params:', v, params)
    valid_waveforms = ["sine", "square", "triangle", "sawtooth"]

    print('params sine:', params)

    x = v[0]['x0']

    waveform = params['waveform']
    A = params['amplitude']
    F = params['frequency']
    Y0 = params['offset']

    if waveform not in valid_waveforms:
        waveform = valid_waveforms[0]
        print('invalid waveform passed as param, using default:', waveform)

    print('A:', A)
    print('F:', F)
    print('Y0:', Y0)
    print('x:', x)

    if waveform == 'sine':
        y = Y0 + A * np.sin(np.radians(2 * np.pi * F) * x)
    elif waveform == 'square':
        y = Y0 + A * signal.square(2 * np.pi * F * x / 10)
    elif waveform == 'triangle':
        y = Y0 + A * signal.sawtooth(2 * np.pi * F * x / 10, 0.5)
    elif waveform == 'sawtooth':
        y = Y0 + A * signal.sawtooth(2 * np.pi * F / 10 * x)

    print('finished sine')
    
    return VectorXY(x = x, y = y)
