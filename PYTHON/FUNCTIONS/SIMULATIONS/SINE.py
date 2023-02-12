import numpy as np
from flojoy import flojoy, DataContainer
from scipy import signal

@flojoy
def SINE(v, params):
    valid_waveforms = ["sine", "square", "triangle", "sawtooth"]
    x = None
    if v.__len__() > 0:
        x = v[0].y

    waveform = params['waveform']
    A = int(params['amplitude'])
    F = int(params['frequency'])
    Y0 =int( params['offset'])
    if waveform not in valid_waveforms:
        waveform = valid_waveforms[0]
        print('invalid waveform passed as param, using default:', waveform)

    if waveform == 'sine':
        y = Y0 + A * np.sin(np.radians(2 * np.pi * F) * x)
    elif waveform == 'square':
        y = Y0 + A * signal.square(2 * np.pi * F * x / 10)
    elif waveform == 'triangle':
        y = Y0 + A * signal.sawtooth(2 * np.pi * F * x / 10, 0.5)
    elif waveform == 'sawtooth':
        y = Y0 + A * signal.sawtooth(2 * np.pi * F / 10 * x)

    return DataContainer(x = x, y = y)
