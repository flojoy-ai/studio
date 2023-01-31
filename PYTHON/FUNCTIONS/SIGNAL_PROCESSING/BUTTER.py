from scipy import signal
import numpy as np
from flojoy import flojoy, DataContainer


@flojoy
def BUTTER(v, params):
    ''' Apply a butterworth filter to an input vector '''

    print('Butterworth inputs:', v)

    x = v[0].x
    sig = v[0].y
    
    sos = signal.butter(10, 15, 'hp', fs=1000, output='sos')
    filtered = signal.sosfilt(sig, sig)

    return DataContainer(x = x, y = filtered)
