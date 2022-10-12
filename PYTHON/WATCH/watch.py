import os
import json
import yaml
import time
from redis import Redis
from rq import Queue, Retry
from rq.job import Job

import warnings
import matplotlib.cbook

warnings.filterwarnings("ignore",category=matplotlib.cbook.mplDeprecation)

import sys
dir_path = os.path.dirname(os.path.realpath(__file__))
sys.path.append(os.path.abspath(os.path.join(dir_path, os.pardir)))

from joyflo import reactflow_to_networkx

# sys.path.append('../FUNCTIONS/')
from FUNCTIONS.VISORS.VCTR import fetch_inputs

from FUNCTIONS.GENERATORS import *
from FUNCTIONS.TRANSFORMERS import *
from FUNCTIONS.VISORS import *

stream = open('STATUS_CODES.yml', 'r')
STATUS_CODES = yaml.safe_load(stream)

from utils import PlotlyJSONEncoder

import os

REDIS_HOST = os.environ.get('REDIS_HOST', 'localhost')
REDIS_PORT = os.environ.get('REDIS_PORT', 6379)

r = Redis(host=REDIS_HOST, port=REDIS_PORT)
q = Queue('flojoy', connection=r)


# Load React flow chart object from JSON file

f = open('PYTHON/WATCH/fc.json')
fc = json.loads(f.read())
elems = fc['elements']

# Replicate the React Flow chart in Python's networkx

convert_reactflow_to_networkx = reactflow_to_networkx(elems) 

# get topological sorting from reactflow_to_networx function imported from flojoy package

topological_sorting = convert_reactflow_to_networkx['topological_sort']

nodes_by_id = convert_reactflow_to_networkx['getNode']()
DG = convert_reactflow_to_networkx['DG']

def report_failure(job, connection, type, value, traceback):
    print(job, connection, type, value, traceback)

def jid(n):
    return 'JOB_ID_{0}'.format(n)

for n in topological_sorting:
    cmd = nodes_by_id[n]['cmd']
    ctrls = nodes_by_id[n]['ctrls']
    print('*********************')
    print('node:', n, 'ctrls:', ctrls, "cmd: ", cmd,)
    print('*********************')
    # print('globals:', globals())
  
    func = getattr(globals()[cmd], cmd)
    print('func:', func)
    job_id = jid(n)

    s = ' '.join([STATUS_CODES['JOB_IN_RQ'], cmd.upper()])
    r.set('SYSTEM_STATUS', s)
   
    if len(list(DG.predecessors(n))) == 0:
        print ('{0} ({1}) has no predecessors'.format(cmd, n))
        q.enqueue(func, 
            retry=Retry(max=100), # TODO: have to understand why the SINE node is failing for few times then succeeds
            job_timeout='3m',
            on_failure=report_failure,
            job_id = job_id, 
            kwargs={'ctrls': ctrls},
            result_ttl=500)
    else:
        previous_job_ids = []
        for p in DG.predecessors(n):
            prev_cmd = DG.nodes[p]['cmd']
            prev_job_id = jid(p)
            previous_job_ids.append(prev_job_id)
            print(prev_cmd, 'is a predecessor to', cmd)            
        q.enqueue(func,
            retry=Retry(max=100),
            job_timeout='3m',
            on_failure=report_failure,
            job_id=job_id,
            depends_on=previous_job_ids,
            previous_job_ids=previous_job_ids,
            result_ttl=500)
        print('ENQUEUING...', cmd, job_id, ctrls, previous_job_ids)


# collect node results
all_node_results = []
topological_sorting = reactflow_to_networkx(elems)['topological_sort']

print('\n\n')

is_any_node_failed = False
for n in topological_sorting:
    job_id = jid(n)
    nd = nodes_by_id[n]
    # TODO have to investigate if and why this fails sometime
    # best is to remove this try catch, so we will have to come back to it soon
    try:
        job = Job.fetch(job_id, connection=r)
    except e:
        print(e)
    job_status, redis_payload, attempt_count = None, None, 0
    while True: # or change it to wait for maximum amount of time, then we can declare job timed out
        time.sleep(0.5)
        job_status= job.get_status(refresh=True)
        redis_payload = job.result
        attempt_count += 1

        print('Job status:', nd['cmd'], job_status, 'origin:', job.origin, 'attempt:', attempt_count)

        if job_status == 'finished':
            break
        if is_any_node_failed:
            print('canceling', nd['cmd'], 'due to failure in another node')
            job.delete()
            job_status = "cancelled"
            break
        if job_status == 'failed':
            is_any_node_failed = True
            break
        if job_status == 'deferred':
            registry = q.deferred_job_registry
            registry.requeue(job_id)

    all_node_results.append({'cmd': nd['cmd'], 'id': nd['id'], 'result':redis_payload, 'job_status': job_status})
    
print('\n\n')
print('SYSTEM_STATUS', STATUS_CODES['RQ_RUN_COMPLETE'])

results_string = json.dumps(all_node_results, cls=PlotlyJSONEncoder)

print('*********************')
print('****** results ******')
print('*********************')
# print(results_string)

r.mset({'SYSTEM_STATUS': STATUS_CODES['RQ_RUN_COMPLETE'],
        'COMPLETED_JOBS': results_string})
