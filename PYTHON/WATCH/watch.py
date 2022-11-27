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

warnings.filterwarnings("ignore", category=matplotlib.cbook.mplDeprecation)

dir_path = os.path.dirname(os.path.realpath(__file__))
sys.path.append(os.path.abspath(os.path.join(dir_path, os.pardir)))

from FUNCTIONS.VISORS import *
from FUNCTIONS.TRANSFORMERS import *
from FUNCTIONS.GENERATORS import *
from utils.utils import PlotlyJSONEncoder

stream = open('STATUS_CODES.yml', 'r')
STATUS_CODES = yaml.safe_load(stream)

REDIS_HOST = os.environ.get('REDIS_HOST', 'localhost')
REDIS_PORT = os.environ.get('REDIS_PORT', 6379)

r = Redis(host=REDIS_HOST, port=REDIS_PORT)
q = Queue('flojoy', connection=r)


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

    # get topological sorting from reactflow_to_networx function imported from flojoy package

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
        r.rpush(jobset_id+'_ALL_NODES', cmd.upper())
        job_status_key = jobset_id + '_'+ cmd.upper() + '_STATUS'
        r.set(job_status_key, 'ENQUEUED')
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
    return




    
    # collect node results
    # all_node_results = []
    # topological_sorting = reactflow_to_networkx(elems)['topological_sort']

    # failed_nodes = []
    # is_any_node_failed = False
    # for n in topological_sorting:
    #     nd = nodes_by_id[n]
    #     job_id = jid(nd['cmd'])
    #     # r_obj = get_redis_obj(jobset_id)
    #     # r.set(jobset_id, dump({**r_obj,
    #     #       'RUNNING_NODE': nd['cmd'].upper()}))
    #     prev_failed_nodes = r_obj['FAILED_NODES'] if 'FAILED_NODES' in r_obj else [
    #     ]
    #     # TODO have to investigate if and why this fails sometime
    #     # best is to remove this try catch, so we will have to come back to it soon
    #     try:
    #         job = Job.fetch(job_id, connection=r)
    #     except Exception:
    #         print(traceback.format_exc())
    #     job_status, redis_payload, attempt_count = None, None, 0
    #     while True:  # or change it to wait for maximum amount of time, then we can declare job timed out
    #         time.sleep(0.5)
    #         job_status = job.get_status(refresh=True)
    #         redis_payload = job.result
    #         attempt_count += 1

    #         if job_status == 'finished':
    #             break
    #         if is_any_node_failed:
    #             job.delete()
    #             job_status = "cancelled"
    #             break
    #         if job_status == 'failed':
    #             failed_nodes.append(str(nd['cmd'].upper()))
    #             prev_failed_nodes.append(str(nd['cmd'].upper()))
    #             r.set(jobset_id, dump({**r_obj,
    #                   'FAILED_NODES': prev_failed_nodes}))
    #             is_any_node_failed = True
    #             break
    #         if job_status == 'deferred':
    #             registry = q.deferred_job_registry
    #             registry.requeue(job_id)

    #     all_node_results.append(
    #         {'cmd': nd['cmd'], 'id': nd['id'], 'result': redis_payload, 'job_status': job_status})

    # print('\n\n')
    # print(STATUS_CODES['RQ_RUN_COMPLETE'], ' for ', jobset_id)

    # results_string = json.dumps(all_node_results, cls=PlotlyJSONEncoder)

    # r.set(jobset_id, dump({'SYSTEM_STATUS': STATUS_CODES['RQ_RUN_COMPLETE'],
    #                    'COMPLETED_JOBS': results_string, 'RUNNING_NODE': '', 'FAILED_NODES': failed_nodes}))
