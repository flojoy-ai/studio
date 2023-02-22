from flojoy import flojoy, JobResultBuilder

@flojoy
def HISTOGRAM(v, params):
    return JobResultBuilder().from_inputs(v).build()