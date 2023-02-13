from flojoy import flojoy
from flojoy import JobResultBuilder

@flojoy
def LOOP_CONDITIONAL(v, params):
    loop_node = params.get('loop_node')
    next_nodes = None if loop_node is None else [loop_node]
    return JobResultBuilder().from_inputs(v).flow_to_nodes(next_nodes).build()