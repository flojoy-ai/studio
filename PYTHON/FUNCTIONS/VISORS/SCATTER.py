from flojoy import flojoy, JobResultBuilder

@flojoy
def SCATTER(v, params):
    return JobResultBuilder().from_params(v).build()