from flojoy import JobResultBuilder, flojoy


@flojoy
def LOOP_CONDITIONAL(v, params):
    loop_node_id = params.get('loop_node', None)
    next_nodes = [loop_node_id] if loop_node_id is not None else []

    return JobResultBuilder()\
        .from_inputs(v)\
        .flow_to_nodes(next_nodes)\
        .build()
