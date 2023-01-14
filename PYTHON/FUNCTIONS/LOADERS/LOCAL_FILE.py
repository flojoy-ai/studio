import traceback
from joyflo import flojoy,DataContainer

@flojoy
def LOCAL_FILE(v, params):
    print('parameters passed to LOCAL_FILE: ', params)
    try:
        filePath = ''
        y = {}
        if v is not None and len(v) != 0:
            filePath = v[0].y
        ctrlInput = params['path']
        fileType = params['file_type']
        opType = params['op_type']
        if ctrlInput is not None and len(ctrlInput.strip()) > 0:
            filePath = ctrlInput
        elif len(filePath.strip()) == 0:
            if fileType == 'image' and opType == 'OD':
                filePath = "../public/assets/object_detection.png"
        print ("File to be loaded: " + filePath)
        with open(filePath, "rb") as fileToBeLoaded:
            f = fileToBeLoaded.read()
            y = [bytearray(f)]
        fileToBeLoaded.close()
    except Exception:
        print(traceback.format_exc())

    return DataContainer(x = None, y = y)
