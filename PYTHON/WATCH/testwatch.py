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
import time

warnings.filterwarnings("ignore", category=matplotlib.cbook.mplDeprecation)

dir_path = os.path.dirname(os.path.realpath(__file__))
sys.path.append(os.path.abspath(os.path.join(dir_path, os.pardir)))

from FUNCTIONS.VISORS import *
from FUNCTIONS.TRANSFORMERS import *
from FUNCTIONS.GENERATORS import *
from FUNCTIONS.LOOPS import *
from FUNCTIONS.COMPARATORS import *

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
def send_to_socket(data):
            requests.post('http://localhost:'+port +
                          '/worker_response', json=json.dumps(data))

def dump(data):
    return json.dumps(data)

def handle_loop_body(cmd,node_serial):
    pass


'''

    |
    |   ----------------------------------------------------
    |
    |   Finished LOOP implementation.
    |   TODO requeue jobs, those are part of loop body.
    |        Currently after remaining break nodes the jobs are not enqueing.
    |
    |   ----------------------------------------------------
    |
'''


def run(**kwargs):
    fc = kwargs['fc']

    jobset_id = kwargs['jobsetId']

    cancel_existing_jobs = kwargs['cancel_existing_jobs']

    print('running flojoy for jobset id: ', jobset_id)

    elems = fc['elements']

    # Replicate the React Flow chart in Python's networkx
    convert_reactflow_to_networkx = reactflow_to_networkx(elems)

    # get topological sorting from reactflow_to_networx function imported from flojoy packag
    topological_sorting = list(convert_reactflow_to_networkx['topological_sort'])

    nodes_by_id = convert_reactflow_to_networkx['getNode']()

    DG = convert_reactflow_to_networkx['DG']

    edge_info = convert_reactflow_to_networkx['edgeInfo']

    def get_redis_obj(id):
        get_obj = r.get(id)
        parse_obj = json.loads(get_obj) if get_obj is not None else {}
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

    def get_current_status():
        r_obj = get_redis_obj(jobset_id)

        '''
            Check for if there's a speical type JOBS
        '''

        special_type_jobs = r_obj['SPECIAL_TYPE_JOBS'] if 'SPECIAL_TYPE_JOBS' in r_obj else {}
        conditional_job_status = special_type_jobs['CONDITIONAL'] if 'CONDITIONAL' in special_type_jobs else {}

        print(conditional_job_status)

        if len(conditional_job_status):
            return conditional_job_status['direction']

        return None

    def check_loop_type(node_serial,cmd,node_id):
        is_part_of_loop,is_part_of_loop_body,is_default,is_part_of_loop_end = False,False,False,False

        if len(list(DG.predecessors(node_serial))) == 0:
            return is_part_of_loop,not is_part_of_loop_body,is_default,is_part_of_loop_end

        if cmd == "LOOP":
            return True,True,False,False

        for value in edge_info[node_id]:

            for key,val in value.items():

                if key == 'source' and 'LOOP' in val:
                    is_part_of_loop = True

                if key == 'sourceHandle':
                    if val == 'body':
                        is_part_of_loop_body = True
                    if val == 'end':
                        is_part_of_loop_end = True

                    if is_part_of_loop and val == None:
                        is_default = True

        return is_part_of_loop,is_part_of_loop_body,is_default,is_part_of_loop_end

    def get_previous_job_ids(cmd,node_serial,loop_nodes):
        previous_job_ids = []

        if cmd == 'LOOP' and len(loop_nodes) > 0:
            status = get_current_status()
            print(status)
            '''
                Remove all predecessors and enqueue only conditional node job_id
            '''
            if status == False:
                for node_id in loop_nodes:
                    id = nodes_by_id[node_id]['id']
                    if 'CONDITIONAL' in id:
                        prev_cmd = DG.nodes[node_id]['cmd']
                        prev_job_id = jid(prev_cmd)
                        previous_job_ids.append(prev_job_id)
                        return previous_job_ids

        for p in DG.predecessors(node_serial):

            prev_cmd = DG.nodes[p]['cmd']

            prev_job_id = jid(prev_cmd)

            previous_job_ids.append(prev_job_id)
        return previous_job_ids


    def check_if_default_node_part_of_loop():
        r_obj = get_redis_obj(jobset_id)
        special_type_jobs = r_obj['SPECIAL_TYPE_JOBS'] if 'SPECIAL_TYPE_JOBS' in r_obj else {}

        status = len(special_type_jobs) and \
                len(special_type_jobs['LOOP']) and \
                special_type_jobs['LOOP']['status'] == 'ongoing'
        return status

    loop_nodes = []
    total_loop_execution = 0

    while len(topological_sorting) != 0:
        print(topological_sorting)
        node_serial = topological_sorting.pop(0)

        cmd = nodes_by_id[node_serial]['cmd']

        if cmd == 'CONDITIONAL':
            total_loop_execution = total_loop_execution + 1

        print("current func: ",cmd)

        func = getattr(globals()[cmd], cmd)
        ctrls = nodes_by_id[node_serial]['ctrls']
        node_id = nodes_by_id[node_serial]['id']

        job_id = 'JOB_' + cmd + '_' + uuid.uuid1().__str__()
        print("job_id: ",job_id)
        s = ' '.join([STATUS_CODES['JOB_IN_RQ'], cmd.upper()])
        r_obj = get_redis_obj(jobset_id)
        # print(r_obj)
        '''
            Check for if there's ALL_JOBS keyword
        '''

        prev_jobs = r_obj['ALL_JOBS'] if 'ALL_JOBS' in r_obj else {}

        '''
            Check for if there's a speical type JOBS
        '''

        special_type_jobs = r_obj['SPECIAL_TYPE_JOBS'] if 'SPECIAL_TYPE_JOBS' in r_obj else {}

        if len(special_type_jobs):

            #check for if its a LOOP JOBS & CURRENTLY ONGOING

            if len(special_type_jobs['LOOP'])  and special_type_jobs['LOOP']['status'] == 'ongoing':

                if cmd == 'BREAK':
                    if special_type_jobs['LOOP']['is_loop_body_execution_finished']:
                        loop_jobs = {
                            "status":"finished",
                            "is_loop_body_execution_finished":True,
                            "is_loop_end_execution_finished":True,
                            "params":ctrls
                        }
                        r.set(jobset_id, dump({
                            **r_obj,'SYSTEM_STATUS': s, 'ALL_JOBS': {
                                **prev_jobs, cmd: job_id
                            },
                            'SPECIAL_TYPE_JOBS':{
                                **special_type_jobs,
                                'LOOP':loop_jobs
                            }
                        }))
                    else:
                        topological_sorting.extend(loop_nodes.copy())
                        topological_sorting.append(node_serial)
                        continue

                elif cmd == 'CONDITIONAL':
                    conditional_jobs = {
                        "direction":False
                    }

                    r.set(jobset_id, dump({
                        **r_obj,'SYSTEM_STATUS': s, 'ALL_JOBS': {
                            **prev_jobs, cmd: job_id
                        },
                        'SPECIAL_TYPE_JOBS':{
                            **special_type_jobs,
                            'CONDITIONAL':conditional_jobs
                        }
                    }))

                else:
                    r.set(jobset_id, dump({
                        **r_obj,'SYSTEM_STATUS': s, 'ALL_JOBS': {
                            **prev_jobs, cmd: job_id
                        },
                        'SPECIAL_TYPE_JOBS':{
                            **special_type_jobs,
                        }
                    }))
        else:
            if cmd == 'LOOP':
                loop_jobs = {
                    "status":"ongoing",
                    "is_loop_body_execution_finished":False,
                    "is_loop_end_execution_finished":False,
                    "params":{
                                "initial_value":ctrls['initial_value']['value'],
                                "total_iterations":ctrls["numder_of_iterations"]["value"],
                                "step":ctrls["iteration_step"]['value']
                            }
                }

                r.set(jobset_id, dump({
                    **r_obj,'SYSTEM_STATUS': s, 'ALL_JOBS': {
                        **prev_jobs, cmd: job_id
                    },
                    'SPECIAL_TYPE_JOBS':{
                        **special_type_jobs,
                        'LOOP':loop_jobs
                    }
                }))

            elif cmd == 'CONDITIONAL':
                conditional_jobs = {
                    "direction":False
                }

                r.set(jobset_id, dump({
                    **r_obj,'SYSTEM_STATUS': s, 'ALL_JOBS': {
                        **prev_jobs, cmd: job_id
                    },
                    'SPECIAL_TYPE_JOBS':{
                        **special_type_jobs,
                        'CONDITIONAL':conditional_jobs
                    }
                }))

            else:
                r.set(jobset_id, dump({
                    **r_obj,'SYSTEM_STATUS': s, 'ALL_JOBS': {
                        **prev_jobs, cmd: job_id
                    },
                    "SPECIAL_TYPE_JOBS":{
                        **special_type_jobs
                    }
                }))

        is_part_of_loop,is_part_of_loop_body,is_default,is_part_of_loop_end = check_loop_type(node_serial,cmd,node_id)

        is_eligible_to_enqueue = False

        if is_part_of_loop:
            if is_part_of_loop_body or is_part_of_loop_end: # checking if its a part of loop body or end nodes
                '''Enqueue'''
                is_eligible_to_enqueue = True
                if is_part_of_loop_body:
                    loop_nodes.append(node_serial) if node_serial not in loop_nodes else node_serial

            elif is_default and special_type_jobs['LOOP']['is_loop_body_execution_finished']:
                '''Enqueue'''
                is_eligible_to_enqueue = True

        else:
            is_eligible_to_enqueue = True

            if check_if_default_node_part_of_loop():
                loop_nodes.append(node_serial) if node_serial not in loop_nodes else node_serial

        print("is eligible to enqueue: ",is_eligible_to_enqueue)

        if is_eligible_to_enqueue:
            '''Enqueue'''
            if len(list(DG.predecessors(node_serial))) == 0:
                q.enqueue(func,
                        # TODO: have to understand why the SINE node is failing for few times then succeeds
                        retry=Retry(max=100),
                        job_timeout='3m',
                        on_failure=report_failure,
                        job_id=job_id,
                        kwargs={'ctrls': ctrls, 'jobset_id': jobset_id,'node_id': nodes_by_id[node_serial]['id']},
                        result_ttl=500)
                time.sleep(2.5)

            else:
                previous_job_ids = get_previous_job_ids(cmd,node_serial,loop_nodes)

                q.enqueue(func,
                        retry=Retry(max=100),
                        job_timeout='3m',
                        on_failure=report_failure,
                        job_id=job_id,
                        kwargs={'ctrls': ctrls,
                                'previous_job_ids': previous_job_ids, 'jobset_id': jobset_id, 'node_id': nodes_by_id[node_serial]['id']},
                        depends_on=previous_job_ids,
                        result_ttl=500)
                time.sleep(2.5)

        else:
            topological_sorting.append(node_serial)

    return

    # try:
    #     for n in topological_sorting:
    #         cmd = nodes_by_id[n]['cmd']
    #         ctrls = nodes_by_id[n]['ctrls']
    #         func = getattr(globals()[cmd], cmd)
    #         job_id = 'JOB_' + cmd + '_' + uuid.uuid1().__str__()
    #         s = ' '.join([STATUS_CODES['JOB_IN_RQ'], cmd.upper()])
    #         r_obj = get_redis_obj(jobset_id)
    #         prev_jobs = r_obj['ALL_JOBS'] if 'ALL_JOBS' in r_obj else {};
    #         r.set(jobset_id, dump({
    #             **r_obj,'SYSTEM_STATUS': s, 'ALL_JOBS': {
    #                 **prev_jobs, cmd: job_id
    #             }
    #         }))
    #         send_to_socket({
    #             'SYSTEM_STATUS': s,
    #             'jobsetId': jobset_id
    #         })
    #         r.rpush(jobset_id+'_ALL_NODES', cmd.upper())
    #         if len(list(DG.predecessors(n))) == 0:
    #             q.enqueue(func,
    #                     # TODO: have to understand why the SINE node is failing for few times then succeeds
    #                     retry=Retry(max=100),
    #                     job_timeout='3m',
    #                     on_failure=report_failure,
    #                     job_id=job_id,
    #                     kwargs={'ctrls': ctrls, 'jobset_id': jobset_id,'node_id': nodes_by_id[n]['id']},
    #                     result_ttl=500)
    #         else:
    #             previous_job_ids = []
    #             for p in DG.predecessors(n):
    #                 prev_cmd = DG.nodes[p]['cmd']
    #                 prev_job_id = jid(prev_cmd)
    #                 previous_job_ids.append(prev_job_id)
    #             q.enqueue(func,
    #                     retry=Retry(max=100),
    #                     job_timeout='3m',
    #                     on_failure=report_failure,
    #                     job_id=job_id,
    #                     kwargs={'ctrls': ctrls,
    #                             'previous_job_ids': previous_job_ids, 'jobset_id': jobset_id, 'node_id': nodes_by_id[n]['id']},
    #                     depends_on=previous_job_ids,
    #                     result_ttl=500)
    # except Exception:
    #         print(traceback.format_exc())
    #         raise

    # return