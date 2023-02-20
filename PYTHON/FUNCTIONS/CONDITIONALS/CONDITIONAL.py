from flojoy import flojoy, DataContainer, JobResultBuilder
from utils.utils import compare_values


@flojoy
def CONDITIONAL(v, params):
    operator = params['operator_type']

    x = v[1].y
    y = v[0].y
    bool_ = compare_values(x[0], y[0], operator)
    
    data = None
    if operator in ["<=", "<"]:
        if not bool_:
            data = DataContainer(x=v[0].x, y=y)
        else:
            data = DataContainer(x=v[1].x, y=x)
    else:
        if bool_:
            data = DataContainer(x=v[0].x, y=y)
        else:
            data = DataContainer(x=v[1].x, y=x)

    next_direction = str(bool_).lower()

    return JobResultBuilder().from_data(data).flow_to_directions([next_direction]).build()