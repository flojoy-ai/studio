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
    b = float(params['rcond'])

    if v.__len__ >0:
        if (v[0].type == 'ordered_pair'): # v[0] is a DataContainer object with type attribute
            print('Performing simple inversion')
            a = v[0].y #scalar valued
            return DataContainer(x=a, y=1/a)
        elif (v[0].type == 'matrix'):
            a = v[0].m
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
        else:
            raise ValueError('Incorrect input DataContainer type.')
    else:
        return DataContainer(type='matrix',m=np.eye(3))
