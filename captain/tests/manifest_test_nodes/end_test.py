from flojoy import DataContainer, JobResultBuilder, flojoy


@flojoy
def END(default: DataContainer):
    return JobResultBuilder().from_inputs([default]).flow_to_nodes([]).build()
