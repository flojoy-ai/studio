import traceback
from flojoy import flojoy, DataContainer
import cv2
import numpy as np
import os

@flojoy
def IMAGE_SMOOTHING(v, params):
    print('\n', 'parameters passed to IMAGE_SMOOTHING: ', params, '\n')
    try:
        data = v[0].y[0]  # Loading data and throw error
    except Exception:
        print('Data not loaded.')
        print(traceback.format_exc())    

    try:
        test = np.fromstring(data, np.uint8)
        image = cv2.imdecode(test, cv2.IMREAD_COLOR) 
        # print(image.shape)

        # Select the type of image smoothing to use.
        kernal = params['kernal']
        if params['function'] == 'average':
            image = cv2.blur(image, (5, 5))
        elif params['function'] == 'gaussian':
            image = cv2.GaussianBlur(image, (kernal,kernal), 0)
        elif params['function'] == 'median':
            image = cv2.medianBlur(image, kernal)
        elif params['function'] == 'bilateral':  # Add another param for bilateral?
            image = cv2.bilateralFilter(image, kernal, kernal * 5, kernal * 5)

        f = cv2.imencode('.png', image)[1]  # encode image to pass to next node.
        y = [bytearray(f)]

        return DataContainer(type='file', y=y, file_type=['image'])

    except Exception:
        print('Error during smoothing.')
        print(traceback.format_exc())
