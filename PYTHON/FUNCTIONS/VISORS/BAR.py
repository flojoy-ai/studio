from flojoy import flojoy, JobResultBuilder

@flojoy
def BAR(v, params):
    return JobResultBuilder().from_inputs(v).build()