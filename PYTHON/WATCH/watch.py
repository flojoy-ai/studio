from flojoy import reactflow_to_networkx
import sys
import os
import json
import yaml
from rq.job import Job
import traceback
import warnings
import matplotlib.cbook
import requests
from dotenv import dotenv_values
import networkx as nx

from collections import defaultdict

warnings.filterwarnings("ignore", category=matplotlib.cbook.mplDeprecation)

dir_path = os.path.dirname(os.path.realpath(__file__))
sys.path.append(os.path.abspath(os.path.join(dir_path, os.pardir)))

from services.job_service import JobService
from FUNCTIONS.LOADERS import *
from FUNCTIONS.SIGNAL_PROCESSING import *
from FUNCTIONS.ARRAY_AND_MATRIX import *
from FUNCTIONS.TIMERS import *
from FUNCTIONS.CONDITIONALS import *
from FUNCTIONS.LOOPS import *
from FUNCTIONS.SIMULATIONS import *
from FUNCTIONS.ARITHMETIC import *
from FUNCTIONS.VISORS import *
from common.CONSTANTS import KEY_ALL_JOBEST_IDS

stream = open('STATUS_CODES.yml', 'r')
STATUS_CODES = yaml.safe_load(stream)

job_service = JobService('flojoy')
q = job_service.queue
print('queue flojoy isEmpty? ', q.is_empty())

conditional_nodes = defaultdict(lambda: {})


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


def get_job_id(job_key: str, redis_key: str) -> str | None:
    try:
        all_jobs = job_service.get_redis_obj(redis_key)
        job_id = all_jobs[job_key]
    except Exception:
        print("Job Id doesn't exist", Exception, traceback.format_exc())
        return None
    return job_id

def report_failure(job, connection, type, value, traceback):
    print(job, connection, type, value, traceback)

# TODO this can be precalculated
def get_previous_job_ids(DG, node_serial):
    previous_job_ids = []
    for p in DG.predecessors(node_serial):
        id = DG.nodes[p]['id']
        previous_job_ids.append(id)
    return previous_job_ids

def check_pred_exist_in_current_queue(current_queue, enqued_job_list, node_serial, DG):
    for p in DG.predecessors(node_serial):
        if (p not in current_queue) and (p not in enqued_job_list):
            return False
    return True

class Graph:
    def __init__(self, DG, edge_label_dict):
        self.DG = DG
        self.edges = DG.edges
        self.nodes = DG.nodes
        self.edge_label_dict = edge_label_dict

        print('\nself.DG:', self.DG)
        print('\nself.nodes:', self.nodes)
        print('\nself.edges:', self.edges)
        print('\nself.DG.nodes():', self.DG.nodes())
        print('\nself.edge_label_dict:', self.edge_label_dict)

        self.nodes_by_id = dict()
        for n, nd in self.DG.nodes().items():
            self.nodes_by_id[n] = nd
        print('\nself.nodes_by_id:', self.nodes_by_id)

        self.adj_list = defaultdict(list)
        self.make_adjancency_list()

        print('\nself.adj_list:', self.adj_list)
        print('\n')


    def make_adjancency_list(self):
        for (src, dest) in self.edges:

            for value in self.edge_label_dict[self.nodes_by_id[dest]['id']]:
                if value['source'] == self.nodes_by_id[src]['id']:
                    source_handle = value['sourceHandle']

            self.adj_list[src].append({
                'target_node_id': self.nodes_by_id[dest]['id'],
                'src_node_id': self.nodes_by_id[src]['id'],
                'target_node': dest,
                'handle': source_handle
            })

def DFS(graph, source, visited, current_loop_nodes, hashmap, get_node_data_by_id):
    # print("source: ", source)
    childs = []
    # print(" get_node_by_id: ", get_node_data_by_id.get(source, "NOt found"))
    cmd = get_node_data_by_id[source]['cmd']
    node_id = get_node_data_by_id[source]['id']

    # if node doesn't have any child, return itself as the only child in this branch
    if source not in graph.adj_list.keys():
        visited[source-1] = True
        return [source]

    body = []
    end = []

    # checking if the source is LOOP type
    if cmd == 'LOOP':

        current_loop_nodes.append(node_id)

        # find the end & body source Handle
        for value in graph.adj_list[source]:
            if value['handle'] == 'body':
                body.append(value['target_node'])
            if value['handle'] == 'end':
                end.append(value['target_node'])

        # traversing the body node first
        for value in body:
            child_node_ids = DFS(graph=graph, source=value, visited=visited,
                                     current_loop_nodes=current_loop_nodes, hashmap=hashmap, get_node_data_by_id=get_node_data_by_id)
            childs = childs + child_node_ids

        for value in end:
            if not visited[value-1]:
                child_node_ids = DFS(graph=graph, source=value, visited=visited,
                                     current_loop_nodes=current_loop_nodes, hashmap=hashmap, get_node_data_by_id=get_node_data_by_id)
                childs = childs + child_node_ids

        visited[source-1] = True
    elif cmd == "CONDITIONAL":
        # find the end & body source Handle
        print(" adj_list: ", graph.adj_list[source])
        for value in graph.adj_list[source]:
            print(" value: ", value)
            output_name = value['handle']
            child_node_ids = DFS(graph=graph, source=value['target_node'], visited=visited,
                                 current_loop_nodes=current_loop_nodes, hashmap=hashmap, get_node_data_by_id=get_node_data_by_id)
            childs = childs + child_node_ids
            conditional_nodes[node_id][output_name.lower()] = child_node_ids

    else:
        for value in graph.adj_list[source]:
           
            child_node_ids = DFS(graph=graph, source=value['target_node'], visited=visited,
                                     current_loop_nodes=current_loop_nodes, hashmap=hashmap, get_node_data_by_id=get_node_data_by_id)
            childs = childs + child_node_ids
    return [source] + childs


def run_old(**kwargs):
    jobset_id = kwargs['jobsetId']
    try:
        fc = kwargs['fc']
        # job id of running node
        my_job_id = kwargs['my_job_id']
        print('running flojoy for jobset id: ', jobset_id)

        jobset_data = job_service.get_redis_obj(jobset_id)
        r.delete('{}_ALL_NODES'.format(jobset_id))

        elems = fc['nodes']
        edges = fc['edges']

        r.set('{}_edges'.format(jobset_id), dump({'edge': edges}))

        # Replicate the React Flow chart in Python's networkx
        convert_reactflow_to_networkx = reactflow_to_networkx(elems, edges)

        # get topological sorting from reactflow_to_networx function imported from flojoy package
        topological_sorting = list(
            convert_reactflow_to_networkx['topological_sort'])

        nodes_by_id = convert_reactflow_to_networkx['getNode']()

        DG = convert_reactflow_to_networkx['DG']

        edge_info = convert_reactflow_to_networkx['edgeInfo']

        graph = Graph(DG, edge_info)
        visited = [False] * len(list(DG.nodes))

        # finding the source of dfs tree
        dfs_source = []
        for node in DG.nodes:
            if len(list(DG.predecessors(node))) == 0:
                dfs_source.append(node)

        hash_map = {}
        current_loop_nodes = []
        for source in dfs_source:
            DFS(graph=graph, source=source, visited=visited,
                current_loop_nodes=current_loop_nodes, hashmap=hash_map, get_node_data_by_id=nodes_by_id)

        hash_map_by_loop = get_hash_loop(hash_map, nodes_by_id, DG)
        loop_body_nodes = get_loop_body_nodes(
            hash_map, hash_map_by_loop.copy())

        loop_nodes = defaultdict()
        enqued_job_list = []
        loop_ongioing_list = []
        redis_env = ""
        current_conditional = ""

        r.set(jobset_id, dump({}))

        print('\n')
        print('All Nodes in topological sorting:')
        print('\n')
        topological_sorting_by_node_id = {}
        for node_serial in topological_sorting:
            id = nodes_by_id[node_serial]['id']
            if node_serial not in topological_sorting_by_node_id:
                topological_sorting_by_node_id[id] = node_serial
            print(node_serial, nodes_by_id[node_serial]
                  ['cmd'], id)

        while len(topological_sorting) != 0:
            print("Topological Order: ", topological_sorting)
            node_serial = topological_sorting.pop(0)
            cmd = nodes_by_id[node_serial]['cmd']
            func = getattr(globals()[cmd], cmd)
            ctrls = nodes_by_id[node_serial]['ctrls']
            node_id = nodes_by_id[node_serial]['id']

            print("Node ID: ", node_id)
            print("\n")

            job_id = node_id
            s = ' '.join([STATUS_CODES['JOB_IN_RQ'], cmd.upper()])
            jobset_data = job_service.get_redis_obj(jobset_id)
            prev_jobs = job_service.get_redis_obj(all_jobs_key)

            special_type_jobs = jobset_data.get(
                'SPECIAL_TYPE_JOBS', {})  # TODO: rename SPECIAL_TYPE_JOBS

            is_eligible_to_enqueue = False  # TODO: Check if it is necessary

            # current_loop = loop_ongioing_list[len(loop_ongioing_list)-1] if len(loop_ongioing_list) > 0 else ""

            is_part_of_loop, is_part_of_loop_body, is_part_of_loop_end, is_eligible = check_loop_type(
                node_serial, cmd, node_id, edge_info, DG, jobset_data)

            if is_part_of_loop:

                if is_part_of_loop_body:
                    is_eligible_to_enqueue = True
                    # loop_nodes[current_loop].append(
                    #     node_serial) if node_serial not in loop_nodes[current_loop] and is_part_of_loop_body else node_serial

                elif is_part_of_loop_end:
                    is_eligible_to_enqueue = is_eligible
                    # loop_nodes[current_loop] = []
                    # if cmd == 'LOOP' and ('LOOP' not in special_type_jobs):
                    #     is_eligible_to_enqueue = True
                    #     loop_nodes[current_loop] = []

                    # elif len(special_type_jobs) == 0:
                    #     is_eligible_to_enqueue = True
                    #     loop_nodes[current_loop] = []

            else:

                is_eligible_to_enqueue = check_if_default_node_part_of_loop(
                    node_serial, enqued_job_list, DG)

                if is_eligible_to_enqueue:
                    # loop_nodes[current_loop].append(
                    #     node_serial) if node_serial not in loop_nodes[current_loop] else node_serial
                    pass
            if is_eligible_to_enqueue != True:
                print("Skipping: ", node_id)

            if len(special_type_jobs):

                if 'LOOP' in special_type_jobs:
                    loop_jobs = special_type_jobs['LOOP'].copy()

                    # current_loop = loop_ongioing_list[len(loop_ongioing_list)-1]
                    # if cmd == 'LOOP' and node_id != current_loop: # integrating nested loop feature
                    #     topological_sorting.append(node_serial)
                    #     continue

                    # if cmd != 'CONDITIONAL':
                    #     if cmd == 'LOOP' and node_id not in loop_jobs:

                    #         conditional_node_id = get_conditional_node_id(node_id,loop_body_nodes)
                    #         intial_value = cmd+"_"+nodes_by_id[node_serial]['label']+"_initial_count"
                    #         total_iteration = cmd + "_"+nodes_by_id[node_serial]['label']+"_iteration_count"
                    #         step = cmd + "_"+ nodes_by_id[node_serial]['label']+"_step"

                    #         loop_job = {
                    #             node_id: {
                    #                 "status": "ongoing",
                    #                 "is_loop_body_execution_finished": False,
                    #                 "params": {
                    #                     "initial_value": int(ctrls[intial_value]['value']),
                    #                     "total_iterations": int(ctrls[total_iteration]["value"]),
                    #                     "current_iteration": int(ctrls[intial_value]['value']), # TODO: Identify where this is set on each iteration
                    #                     "step": int(ctrls[step]['value'])
                    #                 },
                    #                 "conditional_node":conditional_node_id
                    #             }
                    #         }
                    #         loop_jobs.update(loop_job)
                    #         redis_env = dump({
                    #             **r_obj,'SYSTEM_STATUS':s,
                    #             'SPECIAL_TYPE_JOBS':{
                    #                 'LOOP':loop_jobs
                    #             }
                    #         })

                    #     else:
                    #         redis_env = dump({
                    #             **r_obj, 'SYSTEM_STATUS': s,
                    #             'SPECIAL_TYPE_JOBS': {
                    #                 **special_type_jobs,
                    #             }
                    #         })
                    # else:
                    #     check_inputs = True if len(
                    #         nodes_by_id[node_serial]['inputs']) else False

                    #     if check_inputs:
                    #         redis_env = dump({
                    #             **r_obj, 'SYSTEM_STATUS': s,
                    #             'SPECIAL_TYPE_JOBS': {
                    #                 **special_type_jobs,
                    #                 'CONDITIONAL': {
                    #                     "direction": True
                    #                 }
                    #             }
                    #         })
                    #         current_conditional = node_id
                    #     else:
                    #         redis_env = dump({
                    #             **r_obj, 'SYSTEM_STATUS': s,
                    #             'SPECIAL_TYPE_JOBS': {
                    #                 **special_type_jobs,
                    #             }
                    #         })
                    #         if is_eligible_to_enqueue:
                    #             loop_serial_id = find_loop_serial_id(node_id,loop_body_nodes,topological_sorting_by_node_id)
                    #             topological_sorting = [loop_serial_id] + topological_sorting

                    if cmd == 'LOOP' and node_id in special_type_jobs['LOOP']:

                        print(jobset_data)

                        if len(special_type_jobs['LOOP']) and special_type_jobs['LOOP'][node_id]['status'] == 'ongoing':
                            loop_nodes = get_loop_nodes(
                                node_id, hash_map_by_loop, topological_sorting_by_node_id)
                            topological_sorting = loop_nodes + topological_sorting
                        else:
                            del loop_jobs[node_id]

                            redis_env = dump({
                                **jobset_data, 'SYSTEM_STATUS': s,
                                'SPECIAL_TYPE_JOBS': {} if len(loop_jobs) == 0 else {'LOOP': loop_jobs}
                            })

                if 'CONDITIONAL' in special_type_jobs:
                    direction = special_type_jobs['CONDITIONAL']['direction']

                    status = is_eligible_on_condition(node_serial=node_serial, direction=direction,
                                                      DG=DG, edge_info=edge_info, get_job_id=get_job_id, all_job_key=all_jobs_key,
                                                      current_conditional=current_conditional)

                    if not status:
                        continue

                    # if cmd == 'LOOP':

                    #     intial_value = cmd+"_"+nodes_by_id[node_serial]['label']+"_initial_count"
                    #     total_iteration = cmd + "_"+nodes_by_id[node_serial]['label']+"_iteration_count"
                    #     step = cmd + "_"+ nodes_by_id[node_serial]['label']+"_step"

                    #     loop_jobs = {
                    #             node_id:{
                    #             "status": "ongoing",
                    #             "is_loop_body_execution_finished": False,
                    #             "params": {
                    #                 "initial_value": int(ctrls[intial_value]['value']),
                    #                 "total_iterations": int(ctrls[total_iteration]["value"]),
                    #                 "current_iteration": int(ctrls[intial_value]['value']),
                    #                 "step": int(ctrls[step]['value'])
                    #             }
                    #         }
                    #     }

                    #     redis_env = dump({
                    #         **r_obj, 'SYSTEM_STATUS': s,
                    #         'SPECIAL_TYPE_JOBS': {
                    #             'LOOP': loop_jobs
                    #         }
                    #     })

                    #     loop_ongioing_list.append(node_id)
                    #     loop_nodes[node_id] = []
                    #     # topological_sorting.append(node_serial)

                    if cmd == 'CONDITIONAL':
                        check_inputs = True if len(
                            nodes_by_id[node_serial]['inputs']) else False

                        if check_inputs:
                            redis_env = dump({
                                **jobset_data, 'SYSTEM_STATUS': s,
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
                                **jobset_data, 'SYSTEM_STATUS': s,
                                'SPECIAL_TYPE_JOBS': {
                                    **special_type_jobs,
                                }
                            })
                    else:
                        redis_env = dump({
                            **jobset_data, 'SYSTEM_STATUS': s,
                            'SPECIAL_TYPE_JOBS': {
                                **special_type_jobs
                            }
                        })

            else:
                if cmd == 'LOOP':
                    conditional_node_id = get_conditional_node_id(
                        node_id, loop_body_nodes)

                    intial_value = cmd+"_" + \
                        nodes_by_id[node_serial]['label']+"_initial_count"
                    total_iteration = cmd + "_" + \
                        nodes_by_id[node_serial]['label']+"_iteration_count"
                    step = cmd + "_" + \
                        nodes_by_id[node_serial]['label']+"_step"

                    loop_jobs = {
                        node_id: {
                            "status": "ongoing",
                            "is_loop_body_execution_finished": False,
                            "params": {
                                "initial_value": int(ctrls[intial_value]['value']),
                                "total_iterations": int(ctrls[total_iteration]["value"]),
                                "current_iteration": int(ctrls[intial_value]['value']),
                                "step": int(ctrls[step]['value'])
                            },
                            "conditional_node": conditional_node_id
                        }
                    }

                    redis_env = dump({
                        **jobset_data, 'SYSTEM_STATUS': s,
                        'SPECIAL_TYPE_JOBS': {
                            **special_type_jobs,
                            'LOOP': loop_jobs
                        }
                    })

                    loop_ongioing_list.append(node_id)
                    loop_nodes[node_id] = []
                    # topological_sorting.append(node_serial)

                elif cmd == 'CONDITIONAL':
                    conditional_jobs = {
                        "direction": True
                    }

                    redis_env = dump({
                        **jobset_data, 'SYSTEM_STATUS': s,
                        'SPECIAL_TYPE_JOBS': {
                            **special_type_jobs,
                            'CONDITIONAL': conditional_jobs
                        }
                    })
                    current_conditional = node_id
                else:
                    redis_env = dump({
                        **jobset_data, 'SYSTEM_STATUS': s,
                        "SPECIAL_TYPE_JOBS": {
                            **special_type_jobs
                        }
                    })

            if is_eligible_to_enqueue:

                '''Enqueue'''
                if len(list(DG.predecessors(node_serial))) == 0:

                    q.enqueue(func,
                              job_timeout='3m',
                              on_failure=report_failure,
                              job_id=job_id,
                              kwargs={'ctrls': ctrls, 'jobset_id': jobset_id,
                                      'node_id': nodes_by_id[node_serial]['id']},
                              result_ttl=500)
                    enqued_job_list.append(node_serial)

                else:
                    # loop_node_list = [] if loop_nodes == defaultdict() else loop_nodes[current_loop]
                    previous_job_ids = get_previous_job_ids(cmd=cmd, DG=DG, get_job_id=get_job_id, loop_nodes=loop_body_nodes,
                                                            node_id=node_id, node_serial=node_serial, nodes_by_id=nodes_by_id,
                                                            r_obj=jobset_data, all_jobs_key=all_jobs_key)

                    print("previous Jobs Ids: ", previous_job_ids)

                    q.enqueue(func,
                              job_timeout='3m',
                              on_failure=report_failure,
                              job_id=job_id,
                              kwargs={'ctrls': ctrls,
                                      'previous_job_ids': previous_job_ids,
                                      'jobset_id': jobset_id, 'node_id': nodes_by_id[node_serial]['id']},
                              depends_on=previous_job_ids,
                              result_ttl=500)
                    enqued_job_list.append(node_serial)

                    # if cmd == 'LOOP' and current_loop == node_id and json.loads(redis_env)['SPECIAL_TYPE_JOBS'] == {}:
                    #     del loop_nodes[current_loop]
                    #     loop_ongioing_list.pop()

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
        send_to_socket({
            'jobsetId': jobset_id,
            'SYSTEM_STATUS': 'Failed to run Flowchart script on worker... ',
        })
        print('Watch.py run error: ', Exception, traceback.format_exc())


def run(**kwargs):
    jobset_id = kwargs['jobsetId']
    print('running flojoy for jobset id: ', jobset_id)
    try:
        flow_chart = kwargs['fc']
        flojoy_watch_job_id = kwargs['flojoy_watch_job_id']

        nodes = flow_chart['nodes']
        edges = flow_chart['edges']

        networkx_obj = reactflow_to_networkx(nodes, edges)
        topological_sorting = list(networkx_obj['topological_sort']) # topological ordering of the nodes
        node_dict = networkx_obj['getNode']() # node dictionary { node_id --> node }
        DG = networkx_obj['DG'] # networkx representation of the graph
        edge_info = networkx_obj['edgeInfo']
        
        preprocess_graph(DG=DG, edge_info=edge_info, node_dict=node_dict)
        print('conditional_nodes:', conditional_nodes)
        remove_all_conditional_nodes(topological_sorting)
        
        while len(topological_sorting) != 0:
            print("Topological Order: ", topological_sorting)
            node_serial = topological_sorting.pop(0)
            cmd = node_dict[node_serial]['cmd']
            func = getattr(globals()[cmd], cmd)
            ctrls = node_dict[node_serial]['ctrls']
            job_id = node_id = node_dict[node_serial]['id']
            previous_job_ids = get_previous_job_ids(DG=DG, node_serial=node_serial)
            
            job_service.enqueue_job(
                func=func,
                jobset_id=jobset_id,
                job_id=job_id,
                previous_job_ids=previous_job_ids,
                ctrls=ctrls
            )
            job_service.add_job(job_id=job_id, jobset_id=jobset_id)

            if cmd == 'CONDITIONAL':
                job_result={}
                while True:
                    job = job_service.fetch_job(job_id=job_id)
                    if job.get_status() == 'finished':
                        job_result = job.result
                        break
                print(" conditional node job_id: ", job_id)
                direction = str(job_result.get("direction")).lower()
                print(" conditional direction: ", direction)
                print(" conditional_nodes[node_id]: ", node_id, conditional_nodes[node_id])
                nodes_to_enqueue = conditional_nodes[node_id][direction]
                topological_sorting = nodes_to_enqueue + topological_sorting
                

        notify_jobset_finished(jobset_id, flojoy_watch_job_id)
        return
    except Exception:
        send_to_socket({
            'jobsetId': jobset_id,
            'SYSTEM_STATUS': 'Failed to run Flowchart script on worker... ',
        })
        print('Watch.py run error: ', Exception, traceback.format_exc())

def remove_all_conditional_nodes(topological_sorting):
    print('remove_all_conditional_nodes, before:', topological_sorting)
    print('conditional_nodes.items():', conditional_nodes.items())
    for node_id, node in conditional_nodes.items():
        print('node.items():', node.items())
        for direction, child_ids in node.items():
            print('child_ids', child_ids)
            for child_id in child_ids:
                try:
                    print('removing child_id', child_id)
                    topological_sorting.remove(child_id)
                except Exception:
                    pass
    print('remove_all_conditional_nodes, after:', topological_sorting)



def notify_jobset_finished(jobset_id, my_job_id):
    job_service.redis_dao.remove_item_from_list('{}_watch'.format(jobset_id), my_job_id)

def preprocess_graph(DG, edge_info, node_dict):
    graph = Graph(DG, edge_info)
    visited = [False] * len(list(DG.nodes))

    # finding the source of dfs tree
    dfs_source = []
    for node in DG.nodes:
        if len(list(DG.predecessors(node))) == 0:
            dfs_source.append(node)

    hash_map = {}
    current_loop_nodes = []
    for source in dfs_source:
        DFS(graph=graph, source=source, visited=visited,
            current_loop_nodes=current_loop_nodes, hashmap=hash_map, get_node_data_by_id=node_dict)

    # hash_map_by_loop = get_hash_loop(hash_map, node_dict, DG)
    # loop_body_nodes = get_loop_body_nodes(
    #     hash_map, hash_map_by_loop.copy())


   