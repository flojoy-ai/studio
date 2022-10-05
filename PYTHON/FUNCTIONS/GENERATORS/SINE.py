import numpy as np
from .flojoy import flojoy
from scipy import signal

@flojoy
def SINE(node_inputs, params):
    valid_waveforms = ["sine", "square", "triangle", "sawtooth"]

    print('params sine:', params)

    xy0 = node_inputs[0]
    x = xy0['x0']

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

    if waveform == 'sine':
        y = Y0 + A * np.sin(np.radians(2 * np.pi * F) * x)
    elif waveform == 'square':
        y = Y0 + A * signal.square(2 * np.pi * F * x / 10)
    elif waveform == 'triangle':
        y = Y0 + A * signal.sawtooth(2 * np.pi * F * x / 10, 0.5)
    elif waveform == 'sawtooth':
        y = Y0 + A * signal.sawtooth(2 * np.pi * F / 10 * x)

    print('finished sine')
    return {'x0':x, 'y0':y}
