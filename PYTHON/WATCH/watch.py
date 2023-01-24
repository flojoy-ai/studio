from flojoy import reactflow_to_networkx
import sys
import os
import json
import traceback
import warnings
import matplotlib.cbook
import yaml
from redis import Redis
from rq import Queue
from rq.job import Job
import traceback
import warnings
import requests
from dotenv import dotenv_values

warnings.filterwarnings("ignore", category=matplotlib.cbook.mplDeprecation)

dir_path = os.path.dirname(os.path.realpath(__file__))
sys.path.append(os.path.abspath(os.path.join(dir_path, os.pardir)))

from FUNCTIONS.TRANSFORMERS import *
from FUNCTIONS.SIMULATIONS import *
from FUNCTIONS.LOOPS import *
from FUNCTIONS.CONDITIONALS import *
from FUNCTIONS.TIMERS import *
from FUNCTIONS.VISORS import *

stream = open('STATUS_CODES.yml', 'r')
STATUS_CODES = yaml.safe_load(stream)

REDIS_HOST = os.environ.get('REDIS_HOST', 'localhost')
REDIS_PORT = os.environ.get('REDIS_PORT', 6379)

r = Redis(host=REDIS_HOST, port=REDIS_PORT)
q = Queue('flojoy', connection=r)
print('queue flojoy isEmpty? ', q.is_empty())


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


def get_redis_obj(id):
    get_obj = r.get(id)
    parse_obj = json.loads(get_obj) if get_obj is not None else {}
    return parse_obj


def get_job_id(job_key: str, redis_key: str) -> str | None:
    try:
        all_jobs = get_redis_obj(redis_key)
        job_id = all_jobs[job_key]
    except Exception:
        print("Job Id doesn't exist", Exception, traceback.format_exc())
        return None
    return job_id


def report_failure(job, connection, type, value, traceback):
    print(job, connection, type, value, traceback)


def get_loop_status(r_obj, loop_info=False):
    special_type_jobs = r_obj['SPECIAL_TYPE_JOBS'] if 'SPECIAL_TYPE_JOBS' in r_obj else {
    }
    loop_status = len(special_type_jobs) and \
        len(special_type_jobs['LOOP']
            ) if 'LOOP' in special_type_jobs else False
    current_iteration = 0
    initial_value = 0
    loop_ongoing = False
    if loop_status:
        loop_ongoing = special_type_jobs['LOOP']['status'] == 'ongoing' if (
            loop_status and 'status' in special_type_jobs['LOOP']) else False
        loop_finished = special_type_jobs['LOOP']['status'] == 'finished' if (
            loop_status and 'status' in special_type_jobs['LOOP']) else False
        if loop_ongoing or loop_finished:
            current_iteration = special_type_jobs['LOOP']['params']['current_iteration']
            initial_value = special_type_jobs['LOOP']['params']['initial_value']
    if not loop_info:
        return loop_ongoing
    return loop_status, current_iteration, initial_value


def check_loop_type(node_serial, cmd, node_id, current_loop_id, edge_info, DG):
    is_part_of_loop, is_part_of_loop_body, is_part_of_loop_end = False, False, False

    if len(list(DG.predecessors(node_serial))) == 0:
        return is_part_of_loop, not is_part_of_loop_body, is_part_of_loop_end

    if cmd == "LOOP" and current_loop_id == node_id:
        return True, True, False

    for value in edge_info[node_id]:

        for key, val in value.items():

            if key == 'source' and 'LOOP' in val:
                if val == current_loop_id:
                    is_part_of_loop = True

            if key == 'sourceHandle':
                if val == 'body':
                    is_part_of_loop_body = True
                if val == 'end':
                    is_part_of_loop_end = True

    return is_part_of_loop, is_part_of_loop_body, is_part_of_loop_end


def check_if_default_node_part_of_loop(node_serial, enqued_job_list, r_obj, DG):
    loop_status = get_loop_status(r_obj)
    is_eligible_to_enqueue = True
    for p in DG.predecessors(node_serial):
        if p not in enqued_job_list:
            return loop_status, not is_eligible_to_enqueue  # must wait for next cycle
    return loop_status, is_eligible_to_enqueue


def is_eligible_on_condition(node_serial, direction, DG, edge_info, get_job_id, all_job_key,current_conditional):
    id = DG.nodes[node_serial]['id']
    if len(list(DG.predecessors(node_serial))) == 1:
        p = list(DG.predecessors(node_serial))[0]
        prev_cmd = DG.nodes[p]['cmd']
        pred_id = DG.nodes[p]['id']
        if prev_cmd == 'CONDITIONAL':
            if current_conditional != pred_id:
                return False
            edge_label = edge_info[id][0]['sourceHandle']
            if edge_label != 'default':
                if edge_label.lower() != str(direction).lower():
                    return False
            return True
    # fetch previous job_ids
    for p in DG.predecessors(node_serial):
        pred_id = DG.nodes[p]['id']
        prev_cmd = DG.nodes[p]['cmd']
        prev_job_id = get_job_id(job_key="{}{}".format(
            prev_cmd, pred_id), redis_key=all_job_key)
        if prev_job_id == None:
            return False
        try:
            job = Job.fetch(prev_job_id, connection=r)
            if prev_cmd == 'CONDITIONAL':
                if current_conditional != pred_id:
                    return False
                for value in edge_info[id]:
                    if value['source'] == pred_id:
                        edge_label = value['sourceHandle']
                        if edge_label != 'default':
                            if edge_label.lower() != str(direction).lower():
                                return False
        except:
            return False
    return True


def get_previous_job_ids(cmd, node_serial, loop_nodes, node_id, r_obj, nodes_by_id, DG, get_job_id, all_jobs_key):

    loop_status, current_iteration, initial_value = get_loop_status(
        r_obj, loop_info=True)

    previous_job_ids = []

    if cmd == 'LOOP':

        if loop_status and current_iteration != initial_value:

            '''
                Remove all predecessors and enqueue only conditional node job_id
            '''

            for node_id in loop_nodes:
                id = nodes_by_id[node_id]['id']
                if 'CONDITIONAL' in id:
                    prev_cmd = DG.nodes[node_id]['cmd']
                    prev_job_id = get_job_id(
                        job_key=prev_cmd+id, redis_key=all_jobs_key)
                    previous_job_ids.append(prev_job_id)
                    return previous_job_ids

    if cmd == 'CONDITIONAL' and len(loop_nodes) > 0:
        for p in DG.predecessors(node_serial):
            id = nodes_by_id[p]['id']
            prev_cmd = DG.nodes[p]['cmd']
            if prev_cmd == 'LOOP':
                continue
            prev_job_id = get_job_id(
                job_key=prev_cmd+id, redis_key=all_jobs_key)

            previous_job_ids.append(prev_job_id)
        return previous_job_ids

    for p in DG.predecessors(node_serial):
        prev_cmd = DG.nodes[p]['cmd']
        id = DG.nodes[p]['id']
        prev_job_id = get_job_id(
            job_key=prev_cmd+id, redis_key=all_jobs_key)
        previous_job_ids.append(prev_job_id)
    return previous_job_ids


def check_pred_exist_in_current_queue(current_queue, enqued_job_list, node_serial, DG):

    for p in DG.predecessors(node_serial):
        if (p not in current_queue) and (p not in enqued_job_list):
            return False
    return True


def delete_all_running_jobs(all_jobs):
    if all_jobs:
        for key in all_jobs.keys():
            try:
                job = Job.fetch(all_jobs[key], connection=r)
            except Exception:
                print(' Failed to cancel job: ', all_jobs[key])
                print(Exception, traceback.format_exc())
                return True
            if job is not None:
                print('Deleting job: ', job.get_id())
                job.delete()
        print("JOB DELETE OK")


def run(**kwargs):
    try:
        fc = kwargs['fc']
        my_job_id = kwargs['my_job_id']
        jobset_id = kwargs['jobsetId']
        print('running flojoy for jobset id: ', jobset_id)
        all_jobs_key = "{}_ALL_JOBS".format(jobset_id)
        r_obj = get_redis_obj(jobset_id)
        r.delete('{}_ALL_NODES'.format(jobset_id))
        all_jobs = get_redis_obj(all_jobs_key)
        cancel_existing_jobs = kwargs['cancel_existing_jobs']
        if (cancel_existing_jobs):
            delete_all_running_jobs(all_jobs)
            r.delete(all_jobs_key)
        elems = fc['elements']

        # Replicate the React Flow chart in Python's networkx
        convert_reactflow_to_networkx = reactflow_to_networkx(elems)

        # get topological sorting from reactflow_to_networx function imported from flojoy package
        topological_sorting = list(
            convert_reactflow_to_networkx['topological_sort'])

        nodes_by_id = convert_reactflow_to_networkx['getNode']()

        DG = convert_reactflow_to_networkx['DG']

        edge_info = convert_reactflow_to_networkx['edgeInfo']

        '''
            TODO Fixing the child children node, whether they are eligible to enqueue or not
        '''

        loop_nodes = []
        enqued_job_list = []
        current_loop = ""
        redis_env = ""
        current_conditional = ""

        r.set(jobset_id, dump({}))

        print('\n')
        print('All Nodes in topological sorting:')
        print('\n')
        for node_serial in topological_sorting:
            print(node_serial, nodes_by_id[node_serial]
                  ['cmd'], nodes_by_id[node_serial]['id'])

        while len(topological_sorting) != 0:
            node_serial = topological_sorting.pop(0)
            cmd = nodes_by_id[node_serial]['cmd']
            func = getattr(globals()[cmd], cmd)
            ctrls = nodes_by_id[node_serial]['ctrls']
            node_id = nodes_by_id[node_serial]['id']
            job_id = node_id  # 'JOB_' + cmd + '_' + uuid.uuid1().__str__()
            s = ' '.join([STATUS_CODES['JOB_IN_RQ'], cmd.upper()])
            r_obj = get_redis_obj(jobset_id)
            prev_jobs = get_redis_obj(all_jobs_key)

            '''
                Check for if there's a speical type JOBS
            '''

            special_type_jobs = r_obj['SPECIAL_TYPE_JOBS'] if 'SPECIAL_TYPE_JOBS' in r_obj else {
            }

            is_eligible_to_enqueue = False

            if len(special_type_jobs):

                # check for if its a LOOP JOBS & CURRENTLY ONGOING

                if 'LOOP' in special_type_jobs:

                    if cmd == 'LOOP' and node_id != current_loop:
                        topological_sorting.append(node_serial)
                        continue

                    if cmd != 'CONDITIONAL':

                        redis_env = dump({
                            **r_obj, 'SYSTEM_STATUS': s,
                            'SPECIAL_TYPE_JOBS': {
                                **special_type_jobs,
                            }
                        })
                    else:
                        check_inputs = True if len(
                            nodes_by_id[node_serial]['inputs']) else False

                        if check_inputs:
                            redis_env = dump({
                                **r_obj, 'SYSTEM_STATUS': s,
                                'SPECIAL_TYPE_JOBS': {
                                    **special_type_jobs,
                                    'CONDITIONAL': {
                                        "direction": True
                                    }
                                }
                            })
                            current_conditional = node_id
                        else:
                            redis_env = dump({
                                **r_obj, 'SYSTEM_STATUS': s,
                                'SPECIAL_TYPE_JOBS': {
                                    **special_type_jobs,
                                }
                            })

                    if len(special_type_jobs['LOOP']) and special_type_jobs['LOOP']['status'] == 'ongoing':

                        if cmd == 'LOOP':
                            topological_sorting = loop_nodes[1:] + \
                                [loop_nodes[0]] + topological_sorting
                    else:
                        redis_env = dump({
                            **r_obj, 'SYSTEM_STATUS': s,
                            'SPECIAL_TYPE_JOBS': {}
                        })

                if 'CONDITIONAL' in special_type_jobs:
                    direction = special_type_jobs['CONDITIONAL']['direction']

                    status = is_eligible_on_condition(node_serial=node_serial, direction=direction,
                                                      DG=DG, edge_info=edge_info, get_job_id=get_job_id, all_job_key=all_jobs_key,
                                                      current_conditional = current_conditional)

                    if not status:
                        continue

                    if cmd == 'LOOP':

                        intial_value = cmd+"_"+nodes_by_id[node_serial]['label']+"_initial_count"
                        total_iteration = cmd + "_"+nodes_by_id[node_serial]['label']+"_iteration_count"
                        step = cmd + "_"+ nodes_by_id[node_serial]['label']+"_step"

                        loop_jobs = {
                            "status": "ongoing",
                            "is_loop_body_execution_finished": False,
                            "params": {
                                "initial_value": int(ctrls[intial_value]['value']),
                                "total_iterations": int(ctrls[total_iteration]["value"]),
                                "current_iteration": int(ctrls[intial_value]['value']),
                                "step": int(ctrls[step]['value'])
                            }
                        }

                        redis_env = dump({
                            **r_obj, 'SYSTEM_STATUS': s,
                            'SPECIAL_TYPE_JOBS': {
                                # **special_type_jobs,
                                'LOOP': loop_jobs
                            }
                        })

                        current_loop = node_id
                        topological_sorting.append(node_serial)

                    elif cmd =='CONDITIONAL':
                        check_inputs = True if len(
                            nodes_by_id[node_serial]['inputs']) else False

                        if check_inputs:
                            redis_env = dump({
                                **r_obj, 'SYSTEM_STATUS': s,
                                'SPECIAL_TYPE_JOBS': {
                                    **special_type_jobs,
                                    'CONDITIONAL': {
                                        "direction": True
                                    }
                                }
                            })
                            current_conditional = node_id
                        else:
                            redis_env = dump({
                                **r_obj, 'SYSTEM_STATUS': s,
                                'SPECIAL_TYPE_JOBS': {
                                    **special_type_jobs,
                                }
                            })
                    else:
                        redis_env = dump({
                            **r_obj, 'SYSTEM_STATUS': s,
                            'SPECIAL_TYPE_JOBS': {
                                **special_type_jobs
                            }
                        })

            else:
                if cmd == 'LOOP':

                    intial_value = cmd+"_"+nodes_by_id[node_serial]['label']+"_initial_count"
                    total_iteration = cmd + "_"+nodes_by_id[node_serial]['label']+"_iteration_count"
                    step = cmd + "_"+ nodes_by_id[node_serial]['label']+"_step"

                    loop_jobs = {
                        "status": "ongoing",
                        "is_loop_body_execution_finished": False,
                        "params": {
                            "initial_value": int(ctrls[intial_value]['value']),
                            "total_iterations": int(ctrls[total_iteration]["value"]),
                            "current_iteration": int(ctrls[intial_value]['value']),
                            "step": int(ctrls[step]['value'])
                        }
                    }

                    redis_env = dump({
                        **r_obj, 'SYSTEM_STATUS': s,
                        'SPECIAL_TYPE_JOBS': {
                            **special_type_jobs,
                            'LOOP': loop_jobs
                        }
                    })

                    current_loop = node_id
                    topological_sorting.append(node_serial)

                elif cmd == 'CONDITIONAL':
                    conditional_jobs = {
                        "direction": True
                    }

                    redis_env = dump({
                        **r_obj, 'SYSTEM_STATUS': s,
                        'SPECIAL_TYPE_JOBS': {
                            **special_type_jobs,
                            'CONDITIONAL': conditional_jobs
                        }
                    })
                    current_conditional = node_id
                else:
                    redis_env = dump({
                        **r_obj, 'SYSTEM_STATUS': s,
                        "SPECIAL_TYPE_JOBS": {
                            **special_type_jobs
                        }
                    })

            is_part_of_loop, is_part_of_loop_body, is_part_of_loop_end = check_loop_type(
                node_serial, cmd, node_id, current_loop, edge_info, DG)

            if is_part_of_loop:

                if is_part_of_loop_body:
                    is_eligible_to_enqueue = True

                    loop_nodes.append(
                        node_serial) if node_serial not in loop_nodes and is_part_of_loop_body else node_serial

                elif is_part_of_loop_end:

                    if cmd == 'LOOP' and ('LOOP' not in special_type_jobs):
                        is_eligible_to_enqueue = True
                        loop_nodes = []

                    elif len(special_type_jobs) == 0:
                        is_eligible_to_enqueue = True
                        loop_nodes = []

            else:
                is_loop_ongoing, is_eligible_to_enqueue = check_if_default_node_part_of_loop(
                    node_serial, enqued_job_list, r_obj, DG)

                if is_loop_ongoing and is_eligible_to_enqueue:
                    loop_nodes.append(
                        node_serial) if node_serial not in loop_nodes else node_serial

            # if(node_id == 'LOOP-605473d1-492e-47e4-a4de-13be789a79dc'):
            #     break

            if is_eligible_to_enqueue:
                '''Enqueue'''
                if len(list(DG.predecessors(node_serial))) == 0:

                    q.enqueue(func,
                              # TODO: have to understand why the SINE node is failing for few times then succeeds
                              #   retry=Retry(max=3),
                              job_timeout='3m',
                              on_failure=report_failure,
                              job_id=job_id,
                              kwargs={'ctrls': ctrls, 'jobset_id': jobset_id,
                                      'node_id': nodes_by_id[node_serial]['id']},
                              result_ttl=500)
                    enqued_job_list.append(node_serial)

                else:
                    previous_job_ids = get_previous_job_ids(cmd=cmd, DG=DG, get_job_id=get_job_id, loop_nodes=loop_nodes,
                                                            node_id=node_id, node_serial=node_serial, nodes_by_id=nodes_by_id,
                                                            r_obj=r_obj, all_jobs_key=all_jobs_key)

                    q.enqueue(func,
                              #   retry=Retry(max=3),
                              job_timeout='3m',
                              on_failure=report_failure,
                              job_id=job_id,
                              kwargs={'ctrls': ctrls,
                                      'previous_job_ids': previous_job_ids,
                                      'jobset_id': jobset_id, 'node_id': nodes_by_id[node_serial]['id']},
                              depends_on=previous_job_ids,
                              result_ttl=500)
                    enqued_job_list.append(node_serial)

                    if cmd == 'LOOP' and current_loop == node_id and json.loads(redis_env)['SPECIAL_TYPE_JOBS'] == {}:
                        loop_nodes = []
                    # time.sleep(3)

                    # if (node_id == 'LOOP-605473d1-492e-47e4-a4de-13be789a79dc'):
                    #     break

                r.set(jobset_id, redis_env)
                r.set(all_jobs_key, dump({
                    **prev_jobs, str(cmd)+str(node_id): job_id
                }))
                r.lpush('{}_ALL_NODES'.format(jobset_id), node_id)
                if cmd == 'CONDITIONAL':
                    # if is_part_of_loop:
                    while True:
                        job = Job.fetch(job_id, connection=r)
                        if job.get_status() == 'finished':
                            break
            else:
                check = check_pred_exist_in_current_queue(
                    topological_sorting, enqued_job_list, node_serial, DG)

                if check:
                    topological_sorting.append(node_serial)
        r.lrem('{}_watch'.format(jobset_id), 1, my_job_id)
        return
    except Exception:
        print("Watch.py failed to run: ", Exception, traceback.format_exc())