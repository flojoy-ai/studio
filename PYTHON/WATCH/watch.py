
from joyflo import reactflow_to_networkx
import sys
import os
import json
import yaml
import time
from redis import Redis
from rq import Queue, Retry
from rq.job import Job
from rq.worker import Worker
from rq.command import send_kill_horse_command
import traceback

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

# from utils import PlotlyJSONEncoder

REDIS_HOST = os.environ.get('REDIS_HOST', 'localhost')
REDIS_PORT = os.environ.get('REDIS_PORT', 6379)

r = Redis(host=REDIS_HOST, port=REDIS_PORT)
q = Queue('flojoy', connection=r)


def dump(data):
    return json.dumps(data)


def run(fc, jobId):
    print('running flojoy for : ', jobId)

    elems = fc['elements']

    # Stop any running rq job
    workers = Worker.all(r)
    for worker in workers:
        send_kill_horse_command(r, worker.name)

    for i in range(0, r.llen('FAILED_NODES')):
        r.lpop('FAILED_NODES')
    for i in range(0, r.llen('FAILED_REASON')):
        r.lpop('FAILED_REASON')

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

        func = getattr(globals()[cmd], cmd)
        job_id = jid(n)

        s = ' '.join([STATUS_CODES['JOB_IN_RQ'], cmd.upper()])
        r.set(jobId, dump({'SYSTEM_STATUS': s}))

        if len(list(DG.predecessors(n))) == 0:
            q.enqueue(func,
                      # TODO: have to understand why the SINE node is failing for few times then succeeds
                      retry=Retry(max=100),
                      job_timeout='3m',
                      on_failure=report_failure,
                      job_id=job_id,
                      kwargs={'ctrls': ctrls},
                      result_ttl=500)
        else:
            previous_job_ids = []
            for p in DG.predecessors(n):
                prev_cmd = DG.nodes[p]['cmd']
                prev_job_id = jid(p)
                previous_job_ids.append(prev_job_id)
            q.enqueue(func,
                      retry=Retry(max=100),
                      job_timeout='3m',
                      on_failure=report_failure,
                      job_id=job_id,
                      kwargs={'ctrls': ctrls,
                              'previous_job_ids': previous_job_ids, },
                      depends_on=previous_job_ids,
                      result_ttl=500)

    # collect node results
    all_node_results = []
    topological_sorting = reactflow_to_networkx(elems)['topological_sort']

    failed_nodes = []
    is_any_node_failed = False
    for n in topological_sorting:
        job_id = jid(n)
        nd = nodes_by_id[n]
        get_redis_object = r.get(jobId)
        parse_redis_object = json.loads(
            get_redis_object) if get_redis_object is not None else {}
        r.set(jobId, dump({**parse_redis_object,
              'RUNNING_NODE': nd['cmd'].upper()}))
        prev_failed_nodes = parse_redis_object['FAILED_NODES'] if 'FAILED_NODES' in parse_redis_object else [
        ]
        # TODO have to investigate if and why this fails sometime
        # best is to remove this try catch, so we will have to come back to it soon
        try:
            job = Job.fetch(job_id, connection=r)
        except Exception:
            print(traceback.format_exc())
        job_status, redis_payload, attempt_count = None, None, 0
        while True:  # or change it to wait for maximum amount of time, then we can declare job timed out
            time.sleep(0.5)
            job_status = job.get_status(refresh=True)
            redis_payload = job.result
            attempt_count += 1

            if job_status == 'finished':
                break
            if is_any_node_failed:
                job.delete()
                job_status = "cancelled"
                break
            if job_status == 'failed':
                failed_nodes.append(str(nd['cmd'].upper()))
                prev_failed_nodes.append(str(nd['cmd'].upper()))
                r.set(jobId, dump({**parse_redis_object,
                      'FAILED_NODES': prev_failed_nodes}))
                is_any_node_failed = True
                break
            if job_status == 'deferred':
                registry = q.deferred_job_registry
                registry.requeue(job_id)

        all_node_results.append(
            {'cmd': nd['cmd'], 'id': nd['id'], 'result': redis_payload, 'job_status': job_status})

    print('\n\n')
    print(STATUS_CODES['RQ_RUN_COMPLETE'], ' for ', jobId)

    results_string = json.dumps(all_node_results, cls=PlotlyJSONEncoder)

    r.set(jobId, dump({'SYSTEM_STATUS': STATUS_CODES['RQ_RUN_COMPLETE'],
                       'COMPLETED_JOBS': results_string, 'RUNNING_NODE': '', 'FAILED_NODES': failed_nodes}))
