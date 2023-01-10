from joyflo import flojoy,DataContainer

def compare_values(first_value,second_value,operator):
    bool_ = None
    if operator == "<=":
        bool_ = first_value <= second_value
    elif operator == ">":
        bool_ = first_value > second_value
    elif operator == "<":
        bool_ = first_value < second_value
    elif operator == ">=":
        bool_ = first_value >= second_value
    elif operator == "!=" :
        bool_ = first_value != second_value
    else:
        bool_ = first_value == second_value
    return bool_

@flojoy
def CONDITIONAL(v,params):
    print("EXECUTING CONDITIONAL PARAMS")

    operator = params['operator_type']

    type = params['type']

    if type == 'loop':

        initial_value = params['loop_current_iteration']
        total_iterations = params['loop_total_iteration']
        step = params['loop_step']
        current_iteration = params['current_iteration']

        bool_ = compare_values(current_iteration+step,total_iterations,operator)

        if not bool_:

            return {
                "data": DataContainer(x=v[0].x,y=v[0].y),
                "type": 'LOOP',
                "params":{
                    "initial_value" : initial_value,
                    "total_iterations": total_iterations,
                    "current_iteration":current_iteration ,
                    "step":step
                },
                "verdict": 'finished'
            }

        else:

            return {
                "data": DataContainer(x=v[0].x,y=v[0].y),
                "type": 'LOOP',
                "params":{
                    "initial_value" : initial_value,
                    "total_iterations": total_iterations,
                    "current_iteration":current_iteration + step,
                    "step":step
                },
                "verdict": 'ongoing'
            }
    else:

        y1 = v[0].y
        y2 = v[1].y

        bool_ = compare_values(y1[0],y2[0],operator)

        data = None

        if operator in ["<=","<"]:
            if not bool_:
                data = DataContainer(x=v[0].x,y=v[0].y)

            data = DataContainer(x=v[1].x,y = v[1].y)
        else:
            if bool_:
                data = DataContainer(x=v[0].x,y=v[0].y)
            data = DataContainer(x=v[1].x,y = v[1].y)

        return {
            "data" : data,
            "type" : "CONDITIONAL",
            "direction" : bool_
        }
