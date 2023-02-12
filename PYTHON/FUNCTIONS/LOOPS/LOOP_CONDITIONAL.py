from flojoy import flojoy, DataContainer
import os
from flojoy import JobResultBuilder
from redis import Redis
import json

REDIS_HOST = os.environ.get('REDIS_HOST', 'localhost')
REDIS_PORT = os.environ.get('REDIS_PORT', 6379)
r = Redis(host=REDIS_HOST, port=REDIS_PORT)


def get_redis_obj(key):
    get_obj = r.get(key)
    parse_obj = json.loads(get_obj) if get_obj is not None else {}
    return parse_obj


def compare_values(first_value, second_value, operator):
    bool_ = None
    if operator == "<=":
        bool_ = first_value <= second_value
    elif operator == ">":
        bool_ = first_value > second_value
    elif operator == "<":
        bool_ = first_value < second_value
    elif operator == ">=":
        bool_ = first_value >= second_value
    elif operator == "!=":
        bool_ = first_value != second_value
    else:
        bool_ = first_value == second_value
    return bool_


def get_loop_params(r_obj, loop_node_id, key):
    return r_obj.get('SPECIAL_TYPE_JOBS', {}).get('LOOP', {}).get(
        loop_node_id, {}).get('params', {}).get(key, None)


@flojoy
def LOOP_CONDITIONAL(v, params):
    loop_node = params.get('loop_node')
    next_nodes = None if loop_node is None else [loop_node]
    return JobResultBuilder().from_params(v).flow_to_nodes(next_nodes).build()

# @flojoy
# def LOOP_CONDITIONAL(v, params):
#     print("EXECUTING LOOP CONDITIONAL, PARMAS: ", params, " v: ", v)

#     loop_node_id = params['loop_node']
#     jobset_id = params['jobset_id']
#     operator = params['operator_type']

#     r_obj = get_redis_obj(jobset_id)

#     initial_value = get_loop_params(
#         r_obj, loop_node_id, 'initial_value')
#     total_iterations = get_loop_params(
#         r_obj, loop_node_id, 'total_iterations')
#     step = get_loop_params(r_obj, loop_node_id, 'step')
#     current_iteration = get_loop_params(
#         r_obj, loop_node_id, 'current_iteration')

#     is_loop_finished = compare_values(
#         current_iteration+step, total_iterations, operator)

#     params = {
#         "initial_value": initial_value,
#         "total_iterations": total_iterations,
#         "current_iteration": current_iteration,
#         "step": step
#     }

#     result = {
#         "__result__field__": "data",
#         "data": DataContainer(x=v[0].x, y=v[0].y),
#         "type": 'LOOP',
#         "params": params,
#         "verdict": 'finished'
#     }

#     if is_loop_finished:
#         return result
#     else:
#         return {
#             **result,
#             "params": {
#                 **params,
#                 "current_iteration": current_iteration + step,
#             },
#             "verdict": 'ongoing'
#         }
