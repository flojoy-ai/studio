from flojoy import flojoy, JobResultBuilder

@flojoy
def LINE(v, params):
    return JobResultBuilder().from_inputs(v).build()
