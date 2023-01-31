import numpy as np
from flojoy import flojoy, DataContainer

@flojoy
def INVERT(v, params):
    ''' Takes 2 inputs, one matrix and one rcond if not square matrix.
    Inverts them (or pseudo invert) and returns the result. 
    If the entered value is a scalar it returns the multiplciative
    inverse 1/x '''
    print(f'INVERT params: {params}')
    a = np.eye(3)
    if v.__len__ >0:
        a = v[0].y
        b = float(params['rcond'])
    if ((type(a)==float) or (type(a)==int)):
        print('Performing simple inversion')
        retval = 1/a
    elif (type(a) == np.ndarray):
        if (not a.shape[0] == a.shape[1]):
            print('Not square matrix! Using pseudoinversion...')
            assert type(b)==float, "Need scalar value to compare SVDs for pseudoinversion"
            retval = np.linalg.pinv(a, rcond=b, hermitian=False)
        else:
            try:
                retval = np.linalg.inv(a)
            except np.linalg.LinAlgError:
                raise ValueError('Inversion failed! Singular matrix returned...')
    else:
        raise ValueError('Incorrect input type.')
    return DataContainer(type='matrix',m=retval)