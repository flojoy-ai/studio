from flojoy import flojoy, DataContainer
import os
from redis import Redis
import json
from rq.job import Job
import traceback
REDIS_HOST = os.environ.get('REDIS_HOST', 'localhost')
REDIS_PORT = os.environ.get('REDIS_PORT', 6379)

r = Redis(host=REDIS_HOST, port=REDIS_PORT)


def get_redis_obj(id):
    get_obj = r.get(id)
    parse_obj = json.loads(get_obj) if get_obj is not None else {}
    return parse_obj


def fetch_job_input(job_id):
    inputs = []

    try:
        job = Job.fetch(job_id, connection=Redis(
            host=REDIS_HOST, port=REDIS_PORT))
        inputs.append(job.result)
    except Exception:
        print(traceback.format_exc())

    return inputs


@flojoy
def FEEDBACK(v, params):
    job_id = params['job_id']
    jobset_id = params['jobset_id']
    edges = get_redis_obj('{}_edges'.format(jobset_id))['edge']
    dependency_job = ''
    x = None
    y = v[0].y if len(v) > 0 else [1, 3, 2]
    for i in range(len(edges)):
        if edges[i]['source'] == job_id:
            target_handle = edges[i]['targetHandle']
            for j in range(len(edges)):
                if edges[j]['targetHandle'] == target_handle and edges[j]['source'] != job_id:
                    dependency_job = edges[j]['source']

    if dependency_job:
        job_result = fetch_job_input(dependency_job)
        y = job_result[0].y if len(
            job_result) > 0 and job_result[0] is not None and 'y' in job_result[0] else y

    return DataContainer(x=x, y=y)
