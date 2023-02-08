from flojoy import flojoy, DataContainer
import os
from redis import Redis
from rq.job import Job, NoSuchJobError

REDIS_HOST = os.environ.get('REDIS_HOST', 'localhost')
REDIS_PORT = os.environ.get('REDIS_PORT', 6379)


@flojoy
def FEEDBACK(v, params):
    referred_node = params['node_id']
    jobset_id = params['jobset_id']

    x = v[0].y

    try:
        job = Job.fetch("{}_{}".format(jobset_id, referred_node), connection=Redis(
            host=REDIS_HOST, port=REDIS_PORT))
        y = job.result.y
    except (Exception, NoSuchJobError):
        y = v[0].y if len(v) > 0 else [1, 3, 2]
        pass;

    return DataContainer(x=x, y=y)
