from flojoy import flojoy
from flojoy import JobResultBuilder
from FUNCTIONS.LOOPS.LOOP import load_loop_data


@flojoy
def LOOP_CONDITIONAL(v, params):
    loop_node_id = params.get('loop_node')
    is_loop_finished = loop_node_id is None or load_loop_data(
        loop_node_id, -1).is_finished
    next_nodes = None if is_loop_finished else [loop_node_id]

    print('LOOP_CONDITIONAL - is loop finished?', is_loop_finished, 'next nodes:', next_nodes)
    return JobResultBuilder()\
        .from_inputs(v)\
        .flow_to_nodes(next_nodes)\
        .build()
