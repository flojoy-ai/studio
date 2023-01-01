from joyflo import flojoy,DataContainer
from redis import Redis
import os
import json

REDIS_HOST = os.environ.get('REDIS_HOST', 'localhost')
REDIS_PORT = os.environ.get('REDIS_PORT', 6379)
r = Redis(host=REDIS_HOST, port=REDIS_PORT)

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

def set_direction(jobset_id,bool_):
    env_info = r.get(jobset_id)
    r_obj = json.loads(env_info) if env_info is not None else {}
    special_type_jobs = r_obj['SPECIAL_TYPE_JOBS'] if 'SPECIAL_TYPE_JOBS' in r_obj else {}

    conditional_jobs = {
        "direction":bool(bool_)
    }

    r.set(jobset_id, json.dumps({
        **r_obj,
        'SPECIAL_TYPE_JOBS':{
            **special_type_jobs,
            'CONDITIONAL':conditional_jobs
        }
    }))

@flojoy
def CONDITIONAL(v,params):
    print("EXECUTING CONDITIONAL PARAMS")

    print("previous iteration values: ",v)

    jobset_id = params['jobset_id']
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

        x1 = v[0].x
        y1 = v[0].y

        x2 = v[1].x
        y2 = v[1].y

        bool_ = compare_values(y1[0],y2[0],operator)

        set_direction(jobset_id,bool_)

        print(bool_)

        if operator in ["<=","<"]:
            if not bool_:
                return DataContainer(x=v[0].x,y=v[0].y)

            return DataContainer(x=v[1].x,y = v[1].y)
        else:
            if bool_:
                return DataContainer(x=v[0].x,y=v[0].y)
            return DataContainer(x=v[1].x,y = v[1].y)
