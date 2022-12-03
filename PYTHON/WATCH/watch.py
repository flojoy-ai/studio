from joyflo import reactflow_to_networkx
import sys
import os
import json
import yaml
from redis import Redis
from rq import Queue, Retry
from rq.job import Job
import traceback
import uuid
import warnings
import matplotlib.cbook
import requests
from dotenv import dotenv_values

warnings.filterwarnings("ignore", category=matplotlib.cbook.mplDeprecation)

dir_path = os.path.dirname(os.path.realpath(__file__))
sys.path.append(os.path.abspath(os.path.join(dir_path, os.pardir)))

from FUNCTIONS.VISORS import *
from FUNCTIONS.TRANSFORMERS import *
from FUNCTIONS.GENERATORS import *

stream = open('STATUS_CODES.yml', 'r')
STATUS_CODES = yaml.safe_load(stream)

REDIS_HOST = os.environ.get('REDIS_HOST', 'localhost')
REDIS_PORT = os.environ.get('REDIS_PORT', 6379)

r = Redis(host=REDIS_HOST, port=REDIS_PORT)
q = Queue('flojoy', connection=r)

def get_port():
    try:
        p = dotenv_values('.env')['REACT_APP_BACKEND_PORT']
    except:
        p = '8000'
    return p
 
port = get_port()

def dump(data):
    return json.dumps(data)

def run(**kwargs):
    fc = kwargs['fc']
    
    jobset_id = kwargs['jobsetId']

    cancel_existing_jobs = kwargs['cancel_existing_jobs']
    
    print('running flojoy for jobset id: ', jobset_id)

    elems = fc['elements']

    # Replicate the React Flow chart in Python's networkx
    convert_reactflow_to_networkx = reactflow_to_networkx(elems)

    # get topological sorting from reactflow_to_networx function imported from flojoy packag
    topological_sorting = convert_reactflow_to_networkx['topological_sort']

    nodes_by_id = convert_reactflow_to_networkx['getNode']()

    DG = convert_reactflow_to_networkx['DG']

    def get_redis_obj(id):
        get_obj = r.get(id)
        parse_obj = json.loads(get_obj) if get_obj is not None else None
        return parse_obj
    
    r_obj = get_redis_obj(jobset_id)

    if(cancel_existing_jobs):
        if r_obj is not None and 'ALL_JOBS' in r_obj:
            for i in r_obj['ALL_JOBS']:
                try:
                    job = Job.fetch(r_obj['ALL_JOBS'][i], connection=r)
                except Exception:
                    print(traceback.format_exc())
                job.delete()


    def report_failure(job, connection, type, value, traceback):
        print(job, connection, type, value, traceback)

    def jid(n):
        return get_redis_obj(jobset_id)['ALL_JOBS'][n]

    try:
        for n in topological_sorting:
            cmd = nodes_by_id[n]['cmd']
            ctrls = nodes_by_id[n]['ctrls']
            func = getattr(globals()[cmd], cmd)
            job_id = 'JOB_' + cmd + '_' + uuid.uuid1().__str__()
            s = ' '.join([STATUS_CODES['JOB_IN_RQ'], cmd.upper()])
            r_obj = get_redis_obj(jobset_id)
            prev_jobs = r_obj['ALL_JOBS'] if 'ALL_JOBS' in r_obj else {};
            r.set(jobset_id, dump({
                **r_obj,'SYSTEM_STATUS': s, 'ALL_JOBS': {
                    **prev_jobs, cmd: job_id
                }
            }))
            requests.post('http://localhost:'+port +'/worker_response', json=dump({
                'SYSTEM_STATUS': s,
                'jobsetId': jobset_id
            }))
            r.rpush(jobset_id+'_ALL_NODES', cmd.upper())
            if len(list(DG.predecessors(n))) == 0:
                q.enqueue(func,
                        # TODO: have to understand why the SINE node is failing for few times then succeeds
                        retry=Retry(max=100),
                        job_timeout='3m',
                        on_failure=report_failure,
                        job_id=job_id,
                        kwargs={'ctrls': ctrls, 'jobset_id': jobset_id,'node_id': nodes_by_id[n]['id']},
                        result_ttl=500)
            else:
                previous_job_ids = []
                for p in DG.predecessors(n):
                    prev_cmd = DG.nodes[p]['cmd']
                    prev_job_id = jid(prev_cmd)
                    previous_job_ids.append(prev_job_id)
                q.enqueue(func,
                        retry=Retry(max=100),
                        job_timeout='3m',
                        on_failure=report_failure,
                        job_id=job_id,
                        kwargs={'ctrls': ctrls,
                                'previous_job_ids': previous_job_ids, 'jobset_id': jobset_id, 'node_id': nodes_by_id[n]['id']},
                        depends_on=previous_job_ids,
                        result_ttl=500)
    except Exception:
            print(traceback.format_exc())
            raise

    return