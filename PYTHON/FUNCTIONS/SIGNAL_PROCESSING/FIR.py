from scipy import signal
from flojoy import flojoy, DataContainer
import numpy as np

@flojoy
def FIR(v, params):
    ''' Apply a low-pass FIR filter to an input vector. This
    filter takes a few inputs: the sample_rate (will be passed as a parameter
    if the target node is not connected), the desired width of the 
    transition to the stop band and the corresponding attentuation, and
    lastly the cutoff frequency. '''

    sample_rate = params['sample_rate'] #Hz
    transition_width = params['transition_width'] #Hz
    stop_band_attenuation = params['stop_band_attenuation'] # dB
    cutoff_freq = params['cutoff_freq'] # Hz
    print(f'FIR params: {[sample_rate,transition_width,stop_band_attenuation,cutoff_freq]}')

    try:
        times = v[0].x
        x = v[0].y #this is the value of the signal
    except IndexError: #nothing input
        # lets create some default behaviour for testing
        nsamples = 400
        times = np.arange(nsamples) / sample_rate
        test_x = np.cos(2*np.pi*0.5*times) + 0.2*np.sin(2*np.pi*2.5*times+0.1) + \
                0.2*np.sin(2*np.pi*15.3*times) + 0.1*np.sin(2*np.pi*16.7*times + 0.1) + \
                    0.1*np.sin(2*np.pi*23.45*times+.8)
        x = test_x

    # first we need to define the nyquist rate ...
    nyq_rate = sample_rate / 2.0
    # ... then the transition width relative to this
    transition_width /= nyq_rate

    # Now compute order and Kaiser param for the fitler
    N, beta = signal.kaiserord(stop_band_attenuation,transition_width)

    # Now we create the filter with the Kaiser window ...
    taps = signal.firwin(N, cutoff_freq/nyq_rate, window = ('kaiser', beta))

    # ... and then apply it to the signal
    filtered_x = signal.lfilter(taps, 1.0, x)

    # Now, there are two considerations to be had. Firstly, 
    # there is a phase delay in the signal since we have applied finite
    # taps ...
    phase_delay = 0.5 * (N-1) / sample_rate
    # ... and furthermore, the first N-1 samples are 'corrupted' in 
    # the sense that the filter 'sacrifies' them by the imposition 
    # of the initial conditions.
    times = times[N-1:] - phase_delay
    filtered_x = filtered_x[N-1:]
    
    return DataContainer(x = times, y = filtered_x)
