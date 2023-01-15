import traceback
from joyflo import flojoy, DataContainer

from utils.object_detection import detect_object

@flojoy
def OBJECT_DETECTION(v, params):
    try:
        data = v[0].y[0]
        y = detect_object(data)
    except Exception:
        print(traceback.format_exc())

    return DataContainer(type='file', y = y, file_type = v[0].file_type)

