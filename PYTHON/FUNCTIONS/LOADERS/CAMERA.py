import cv2
import os
from flojoy import flojoy, DataContainer

@flojoy
def CAMERA(v, params):
    '''
    Take a picture from a connected camera using OpenCV.
    If no camera is connected, this will load the example image: "object_detection.png".
    Perhaps after testing is finished, an error should be thrown if no camera was detected.
    '''
    print('parameters passed to CAMERA: ', params)
    y = {}
    camera_test = False  # Value to test if image is the default image.

    try:
        camera_index = int(params.get('camera_ind', -1))
        camera = cv2.VideoCapture(camera_index)  # Camera indicator for selection of specific camera
        test = camera.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
        # print('\n', test, '\n')  # Print to check if setting the resolution worked.
        camera.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)

        return_value, image = camera.read()  # Read camera. Return value can be useful for testing.
        if image is None:
            raise cv2.error

        # print(image.shape)
        camera_test = True  # Camera has been detected.
        camera.release()  # Release the camera for further use.
        del(camera)

    except cv2.error as camera_error:  # Catch error for when a camera isn't detected. Should it throw an error for production?
        pass

    if not camera_test:
        print('OpenCV cannot read the specified camera.')
        print('Loading backup image.')
        filePath = "../public/assets/object_detection.png"  # Load example image instead for testing.
        # Load the file and put into bytearray.
        print ("File to be loaded: " + filePath)
        with open(filePath, "rb") as fileToBeLoaded:
            f = fileToBeLoaded.read()
            # print(type(cv2.imread(filePath)))
            y = [bytearray(f)]
            # print(type(f))
            # print(type(bytearray(f)))
        fileToBeLoaded.close()

    else:
        f = cv2.imencode('.png', image)[1]  # encode image to pass to next node.
        y = [bytearray(f)]

    return DataContainer(type = 'file', y = y, file_type = ['image'])
