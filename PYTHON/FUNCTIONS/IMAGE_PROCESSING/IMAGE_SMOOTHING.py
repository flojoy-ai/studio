import traceback
from flojoy import flojoy, DataContainer
import cv2
import numpy as np
import os


@flojoy
def IMAGE_SMOOTHING(v, params):
    print("\n", "parameters passed to IMAGE_SMOOTHING: ", params, "\n")
    try:
        data = v[0].y[0]  # Loading data and throw error
    except Exception:
        print("Data not loaded.")
        print(traceback.format_exc())

    try:
        test = np.fromstring(data, np.uint8)
        image = cv2.imdecode(test, cv2.IMREAD_COLOR)
        # print(image.shape)

        # Select the type of image smoothing to use.
        kernel = int(params.get("kernel", 5))
        smoothing_type = params.get("smoothing_type", "average")
        if smoothing_type == "average":
            image = cv2.blur(image, (kernel, kernel))
        elif smoothing_type == "gaussian":
            image = cv2.GaussianBlur(image, (kernel, kernel), 0)
        elif smoothing_type == "median":
            image = cv2.medianBlur(image, kernel)
        elif smoothing_type == "bilateral":  # Add another param for bilateral?
            image = cv2.bilateralFilter(image, kernel, kernel * 5, kernel * 5)

        f = cv2.imencode(".png", image)[1]  # encode image to pass to next node.
        y = [bytearray(f)]

        return DataContainer(type="file", y=y, file_type=["image"])

    except Exception:
        print("Error during smoothing.")
        print(traceback.format_exc())
