from flojoy import flojoy, JobResultBuilder
from .template import init_template

@flojoy
def SCATTER3D(v, params):
    return JobResultBuilder().from_inputs(v).build()