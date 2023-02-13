from flojoy import flojoy, DataContainer, JobResultBuilder
from utils.utils import compare_values


@flojoy
def CONDITIONAL(v, params):
    operator = params['operator_type']

    y1 = v[0].y
    y2 = v[1].y
    bool_ = compare_values(y1[0], y2[0], operator)
    
    data = None
    if operator in ["<=", "<"]:
        if not bool_:
            data = DataContainer(x=v[0].x, y=v[0].y)
        else:
            data = DataContainer(x=v[1].x, y=v[1].y)
    else:
        if bool_:
            data = DataContainer(x=v[0].x, y=v[0].y)
        else:
            data = DataContainer(x=v[1].x, y=v[1].y)

    next_direction = str(bool_).lower()

    return JobResultBuilder().from_data(data).flow_to_directions([next_direction]).build()