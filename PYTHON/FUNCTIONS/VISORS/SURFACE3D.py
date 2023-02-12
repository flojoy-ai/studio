from flojoy import flojoy, JobResultBuilder

@flojoy
def SURFACE3D(v, params):
    return JobResultBuilder().from_params(v).build()