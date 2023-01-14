import traceback
import numpy as np
from joyflo import flojoy,DataContainer

@flojoy
def LOCAL_FILE(v, params):
    print('parameters passed to LOCAL_FILE: ', params)
    try:
        filePath = v[0].y
        ctrlInput = params.path
        fileType = params.file_type
        opType = params.op_type
        if ctrlInput is not None and len(ctrlInput.trim()) > 0:
            filePath = ctrlInput
        elif filePath is None:
            if fileType == 'image' and opType == 'OD':
                filePath = "../../../public/assets/object_detection.png"
        print ("File to be loaded: " + filePath)
        with open(filePath, "rb") as fileToBeLoaded:
            f = fileToBeLoaded.read()
            b = bytearray(f)
        fileToBeLoaded.close()
    except Exception:
        print(traceback.format_exc())

    return DataContainer(x = None, y = b)
