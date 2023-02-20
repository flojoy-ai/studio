from flojoy import flojoy, DataContainer
import os
from redis import Redis
from rq.job import Job, NoSuchJobError
import traceback
REDIS_HOST = os.environ.get('REDIS_HOST', 'localhost')
REDIS_PORT = os.environ.get('REDIS_PORT', 6379)


@flojoy
def FEEDBACK(v, params):
    referred_node = params['referred_node']

    x = v[0].y

    try:
        job = Job.fetch(referred_node, connection=Redis(
            host=REDIS_HOST, port=REDIS_PORT))
        y = job.result.y
    except (Exception, NoSuchJobError):
        y = v[0].y if len(v) > 0 else [1, 3, 2]
        print(traceback.format_exc())
        pass;

    return DataContainer(x=x, y=y)
