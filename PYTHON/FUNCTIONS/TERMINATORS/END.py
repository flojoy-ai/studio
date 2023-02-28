from flojoy import flojoy, JobResultBuilder


@flojoy
def END(v, params):
    return JobResultBuilder()\
        .from_inputs(v)\
        .flow_to_nodes([])\
        .build()
