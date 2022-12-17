from joyflo import flojoy
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
    print(special_type_jobs)
    if len(special_type_jobs):
        return special_type_jobs['LOOP']['params']['initial_value'],special_type_jobs['LOOP']['params']['total_iterations'],special_type_jobs['LOOP']['params']['step']
    return None,None,None

def set_body_execution_done(jobset_id):

    env_info = r.get(jobset_id)
    r_obj = json.loads(env_info) if env_info is not None else {}
    special_type_jobs = r_obj['SPECIAL_TYPE_JOBS'] if 'SPECIAL_TYPE_JOBS' in r_obj else {}

    loop_jobs = {
        "status":"finished",
        "is_loop_body_execution_finished":True,
        "is_loop_end_execution_finished":False,
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
        "is_loop_end_execution_finished":False,
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

@flojoy
def CONDITIONAL(v,params):
    print("EXECUTING CONDITIONAL PARAMS")
    print(params)
    jobset_id = params['jobset_id']
    operator = params['operator_type']

    initial_value, total_iterations,step = get_iteration_info(jobset_id)

    print("initial value ",initial_value)

    if operator == "<=":
        bool_ = total_iterations <= initial_value + step
    elif operator == ">":
        bool_ = total_iterations > initial_value + step
    elif operator == "<":
        bool_ = total_iterations < initial_value + step
    elif operator == ">=":
        bool_ = total_iterations < initial_value + step
    elif operator == "!=" :
        bool_ = total_iterations != initial_value + step
    else:
        bool_ = total_iterations == initial_value + step
    print("Bool value: ",bool_)

    if bool_:
        set_body_execution_done(jobset_id)
    else:
        increase_current_iteration(jobset_id,initial_value,total_iterations,step)

    return v