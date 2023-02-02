from flojoy import flojoy, DataContainer
import traceback

@flojoy
def LINE(v, params):
    try:
        x = v[0].x
        y = v[0].y
    except Exception:
        print(traceback.format_exc())

    return DataContainer(x = x, y = y)