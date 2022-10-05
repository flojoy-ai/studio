import numpy as np
from .flojoy import flojoy

@flojoy
def ADD(node_inputs, params):
    ''' Add 2 input vectors and return the result '''
    y2 = [0]
    
    x = node_inputs[0]['x0']
    if len(node_inputs) == 2:
        y2 = node_inputs[1]['y0']
    y = np.add(
        node_inputs[0]['y0'], 
        y2)
    return {'x0':x, 'y0':y}