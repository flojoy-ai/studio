from flojoy import flojoy, JobResultBuilder, DataContainer


# TODO: Implement arbitrary number of inputs
@flojoy
def END(default: DataContainer):
    return JobResultBuilder().from_inputs([default]).flow_to_nodes([]).build()
