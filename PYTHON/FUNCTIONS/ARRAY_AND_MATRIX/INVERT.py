import numpy as np
from flojoy import flojoy, DataContainer

@flojoy
def INVERT(v, params):
    ''' Takes 2 inputs, one matrix and one rcond if not square matrix.
    Inverts them (or pseudo invert) and returns the result '''
    a = np.eye(3)
    b = 1.0
    if len(v) == 2:
        a = v[0].y
        b = v[1]['y']
    if (not a.shape[0] == a.shape[1]):
        print('Not square matrix! Using pseudoinversion...')
        assert type(b)==float, "Need scalar value to compare SVDs for pseudoinversion"
        retval = np.linalg.pinv(a, rcond=b, hermitian=False)
    else:
        try:
            retval = np.linalg.inv(a)
        except np.linalg.LinAlgError:
            raise ValueError('Inversion failed! Singular matrix returned...')
    return DataContainer(type='matrix',m=retval)