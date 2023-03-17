import cv2
import os
from flojoy import flojoy, DataContainer

@flojoy
def CAMERA(v, params):
    '''
    Take a picture from a connected camera using OpenCV.
    If no camera is connected, this will load the example image: "object_detection.png".
    '''
    print('parameters passed to CAMERA: ', params)
    y = {}
    camera_test = False  # Value to test if image is the default image.

    try:
        camera = cv2.VideoCapture(params['camera_ind'])  # Camera indicator for selection of specific camera
        return_value, image = camera.read()  # Read camera
        filePath = "camera.png"
        cv2.imwrite(filePath, image)
        camera_test = True
    except cv2.error as camera_error:  # Catch error for when a camera isn't detected.
        print('OpenCV cannot read the specified camera.')
        filePath = "../public/assets/object_detection.png"  # Load example image instead. Should it throw an error?

    # Load the file then delete if it's the file from the camera.
    print ("File to be loaded: " + filePath)
    with open(filePath, "rb") as fileToBeLoaded:
        f = fileToBeLoaded.read()
        y = [bytearray(f)]
    fileToBeLoaded.close()

    if camera_test:
        os.remove(filePath)
    camera.release()
    del(camera)

    return DataContainer(type = 'file', y = y, file_type = ['image'])
