import traceback
from flojoy import flojoy, DataContainer

from utils.object_detection.object_detection import detect_object


@flojoy
def OBJECT_DETECTION(v, params):
    try:
        print('Detecting objects...')
        data = v[0].y[0]
        y = [detect_object(data)]
        file_type = v[0].file_type
        return DataContainer(type='file', y=y, file_type=file_type)
    except Exception:
        print(traceback.format_exc())
        raise
