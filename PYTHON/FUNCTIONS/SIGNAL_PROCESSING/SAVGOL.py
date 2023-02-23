import scipy
from flojoy import flojoy, DataContainer
import warnings


@flojoy
def SAVGOL(v, params):
    ''' Apply a Savitzky-Golay filter to an input vector.
    The default behaviour is implementing a 3-point moving average of the data. '''
    print('Savgol inputs:', v)
    signal = v[0].y
    window_length = int(params['wlen'])
    poly_order = int(params['porder'])
    if poly_order >= window_length:
        warnings.warn("Polynomial order is greater than the window size. Using p=w-1...")
        poly_order = window_length - 1
    filtered = scipy.signal.savgol_filter(signal, window_length,poly_order)
    return DataContainer(x = signal, y = filtered)
