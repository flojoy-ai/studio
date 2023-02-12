import time
from flojoy import reactflow_to_networkx, get_next_directions, get_next_nodes
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

def DFS(graph, source, node_dict):
    childs = []
    cmd = node_dict[source]['cmd']
    node_id = node_dict[source]['id']
    print('source:', source, 'node_id:', node_id)

    # if node doesn't have any child, return itself as the only child in this branch
    if source not in graph.adj_list.keys():
        print('source:', source, 'source does not have any child, ignoring..')
        return [source]

    print('source:', source, 'adjList:', graph.adj_list[source])
    for value in graph.adj_list[source]:
        child_source = value['target_node']
        if cmd in ["CONDITIONAL", "LOOP"]:
            child_node_ids = DFS(graph=graph, source=child_source, node_dict=node_dict)
            childs = childs + child_node_ids
            direction = value['handle'].lower()
            conditional_node_childs = conditional_nodes[node_id].get(direction, [])
            print('source:', source, 'adding conditional nodes to direction:', direction, "child_node_ids:", child_node_ids)            
            child_node_ids = list(filter(lambda x: x not in conditional_node_childs, child_node_ids))
            conditional_nodes[node_id][direction] = conditional_node_childs + child_node_ids
            print('source:', source, 'after adding conditional nodes to direction:', direction, "nodes:", conditional_nodes[node_id][direction])            
        else:
            print('source:', source, 'not a special command, ignoring..')
            child_node_ids = DFS(graph=graph, source=child_source, node_dict=node_dict)
            childs = childs + child_node_ids

    print('\n')
    return [source] + childs

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
        node_by_serial = networkx_obj['get_node_by_serial']() # node dictionary { node_serial --> node }
        node_serial_by_id = networkx_obj['get_node_serial_by_id']() # node dictionary { node_id --> node }
        DG = networkx_obj['DG'] # networkx representation of the graph
        edge_info = networkx_obj['edgeInfo']

        print('node_by_serial:', node_by_serial)
        print('node_serial_by_id:', node_serial_by_id)
        
        preprocess_graph(DG=DG, edge_info=edge_info, node_dict=node_by_serial)
        print('conditional_nodes:', conditional_nodes)
        remove_all_conditional_nodes(topological_sorting)

        print("\n\n*** preprocessing finished, starting topological enqueuing")
        
        while len(topological_sorting) != 0:
            print("\n\nScheduling next node\nTopological Order: ", topological_sorting)
            node_serial = topological_sorting.pop(0)
            node = node_by_serial[node_serial]
            # print('node:', node)
            cmd = node['cmd']
            func = getattr(globals()[cmd], cmd)
            ctrls = node['ctrls']
            job_id = node_id = node['id']
            previous_job_ids = get_previous_job_ids(DG=DG, node_serial=node_serial)
            
            job_service.enqueue_job(
                func=func,
                jobset_id=jobset_id,
                job_id=job_id,
                previous_job_ids=previous_job_ids,
                ctrls=ctrls
            )
            job_service.add_job(job_id=job_id, jobset_id=jobset_id)

            ## TODO this should check if a node has multiple output directions
            if cmd in ['CONDITIONAL', 'LOOP', 'LOOP_CONDITIONAL']:
                print("\nprocessing a conditional node job_id: ", job_id)
                job_result = wait_for_job(job_id)

                # process special directions
                print("get_next_directions:", get_next_directions(job_result))
                for direction_ in get_next_directions(job_result):
                    direction = direction_.lower()
                    print(" adding nodes for direction: ", direction, conditional_nodes[node_id])
                    nodes_to_enqueue = conditional_nodes[node_id][direction]
                    topological_sorting = nodes_to_enqueue + topological_sorting

                # TODO add supporrt for instruction: flow to nodes
                for next_node_id in get_next_nodes(job_result):
                    next_node_serial = node_serial_by_id[next_node_id]
                    print('add node id:', next_node_id, 'to topological ordered list', 'serial:',  next_node_serial)
                    topological_sorting = [next_node_serial] + topological_sorting
                

        notify_jobset_finished(jobset_id, flojoy_watch_job_id)
        return
    except Exception:
        send_to_socket({
            'jobsetId': jobset_id,
            'SYSTEM_STATUS': 'Failed to run Flowchart script on worker... ',
        })
        print('Watch.py run error: ', Exception, traceback.format_exc())

def wait_for_job(job_id):
    while True:
        time.sleep(.01)
        job = job_service.fetch_job(job_id=job_id)
        job_status = job.get_status()
        print('job_status:', job_status)
        if job_status == 'finished' or job_status == 'failed':
            job_result = job.result
            break
    return job_result

def remove_all_conditional_nodes(topological_sorting):
    print('remove_all_conditional_nodes, before:', topological_sorting)
    print('conditional_nodes.items():', conditional_nodes.items())
    for node_id, node in conditional_nodes.items():
        for direction, child_ids in node.items():
            for child_id in child_ids:
                try:
                    topological_sorting.remove(child_id)
                except Exception:
                    pass
    print('remove_all_conditional_nodes, after:', topological_sorting)

def notify_jobset_finished(jobset_id, my_job_id):
    job_service.redis_dao.remove_item_from_list('{}_watch'.format(jobset_id), my_job_id)

def preprocess_graph(DG, edge_info, node_dict):
    graph = Graph(DG, edge_info)

    # finding the source of dfs tree which are nodes without any incoming edge
    dfs_sources = []
    for node in DG.nodes:
        if len(list(DG.predecessors(node))) == 0:
            dfs_sources.append(node)

    for source in dfs_sources:
        DFS(graph=graph, source=source, node_dict=node_dict)

   