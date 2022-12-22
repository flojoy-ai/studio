from joyflo import flojoy,DataContainer
from redis import Redis
import os
import json

REDIS_HOST = os.environ.get('REDIS_HOST', 'localhost')
REDIS_PORT = os.environ.get('REDIS_PORT', 6379)
r = Redis(host=REDIS_HOST, port=REDIS_PORT)

def get_iteration_info(jobset_id):

    env_info = r.get(jobset_id)
    parse_obj = json.loads(env_info) if env_info is not None else {}

    special_type_jobs = parse_obj['SPECIAL_TYPE_JOBS'] if 'SPECIAL_TYPE_JOBS' in parse_obj else {}

    if len(special_type_jobs) and 'LOOP' in special_type_jobs:
        return special_type_jobs['LOOP']['params']['initial_value'],special_type_jobs['LOOP']['params']['total_iterations'],special_type_jobs['LOOP']['params']['step']
    return None,None,None

def set_body_execution_done(jobset_id):

    env_info = r.get(jobset_id)
    r_obj = json.loads(env_info) if env_info is not None else {}
    special_type_jobs = r_obj['SPECIAL_TYPE_JOBS'] if 'SPECIAL_TYPE_JOBS' in r_obj else {}

    loop_jobs = {
        "status":"finished",
        "is_loop_body_execution_finished":True,
        "params":{}
    }

    conditional_jobs = {
        "direction":True
    }

    r.set(jobset_id, json.dumps({
        **r_obj,
        'SPECIAL_TYPE_JOBS':{
            **special_type_jobs,
            'LOOP':loop_jobs,
            'CONDITIONAL':conditional_jobs
        }
    }))

def increase_current_iteration(jobset_id,initial_value,total_iterations,step):

    env_info = r.get(jobset_id)
    r_obj = json.loads(env_info) if env_info is not None else {}
    special_type_jobs = r_obj['SPECIAL_TYPE_JOBS'] if 'SPECIAL_TYPE_JOBS' in r_obj else {}

    loop_jobs = {
        "status":"ongoing",
        "is_loop_body_execution_finished":False,
        "params":{
                "initial_value":initial_value + step,
                "total_iterations":total_iterations,
                "step":step
            }
    }

    conditional_jobs = {
        "direction":False
    }

    r.set(jobset_id, json.dumps({
        **r_obj,
        'SPECIAL_TYPE_JOBS':{
            **special_type_jobs,
            'LOOP':loop_jobs,
            'CONDITIONAL':conditional_jobs
        }
    }))

def condition_type(jobset_id):
    env_info = r.get(jobset_id)
    parse_obj = json.loads(env_info) if env_info is not None else {}

    special_type_jobs = parse_obj['SPECIAL_TYPE_JOBS'] if 'SPECIAL_TYPE_JOBS' in parse_obj else {}

    if 'LOOP' in special_type_jobs and special_type_jobs['LOOP']['status'] == 'ongoing':
        return 'LOOP'
    return 'CONDITION'

def compare_values(first_value,second_value,operator):
    bool_ = None
    if operator == "<=":
        bool_ = first_value <= second_value
    elif operator == ">":
        bool_ = first_value > second_value
    elif operator == "<":
        bool_ = first_value < second_value
    elif operator == ">=":
        bool_ = first_value < second_value
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
    print("params: ",params)
    print("value: ",v)
    jobset_id = params['jobset_id']
    operator = params['operator_type']

    type = condition_type(jobset_id=jobset_id)

    if type == 'LOOP':
        initial_value, total_iterations,step = get_iteration_info(jobset_id)

        print("initial value ",initial_value)

        bool_ = compare_values(total_iterations,initial_value+step,operator)

        print("Bool value: ",bool_)

        if bool_:
            set_body_execution_done(jobset_id)
        else:
            increase_current_iteration(jobset_id,initial_value,total_iterations,step)

        return DataContainer(x=v[0].x,y=v[0].y)

    else:
        x1 = v[0].x
        y1 = v[0].y

        x2 = v[1].x
        y2 = v[1].y


        print(x1[0])
        print(x2[0])
        # comparing only x values, if x is none, then comparing only y values

        if x1[0] == x2[0] :
            bool_ = compare_values(y1[0],y2[0],params)
        else:
            bool_ = compare_values(x1[0],x2[0],params)

        print(bool_)

        set_direction(jobset_id,bool_)

        if bool_:
            return DataContainer(x=v[0].x,y=v[0].y)

        return DataContainer(x=v[1].x,y = v[1].y)