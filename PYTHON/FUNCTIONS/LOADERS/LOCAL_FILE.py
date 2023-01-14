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
        if ctrlInput is not None:
            filePath = ctrlInput
        elif filePath is None:
            raise Exception('No file path given')
        y = ''
    except Exception:
        print(traceback.format_exc())

    return DataContainer(x = None, y = y)
