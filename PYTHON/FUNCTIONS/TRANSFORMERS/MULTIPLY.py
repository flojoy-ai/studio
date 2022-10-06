import numpy as np
from joyflo import flojoy

@flojoy
def MULTIPLY(node_inputs, params):
    ''' Takes 2 input vectors, multiplies them, and returns the result '''

    print('MULTIPLY started with params', params)

    x = node_inputs[0]['x0']

    y = np.multiply(
        node_inputs[0]['y0'], 
        node_inputs[1]['y0'])

    return {'x0':x, 'y0':y}