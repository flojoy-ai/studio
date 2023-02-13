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
from utils.flow_utils import find_flows, apply_topology, remove_flows_from_topology
from utils.flows import Flows
from utils.graph import Graph

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

topology_order_by_node_serial = {}
topology = []
graph: Graph = None
flows: Flows = None


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

def run(**kwargs):
    global flows, graph, topology
    jobset_id = kwargs['jobsetId']
    print('\nrunning flojoy for jobset id: ', jobset_id)
    try:
        flow_chart = kwargs['fc']
        flojoy_watch_job_id = kwargs['flojoy_watch_job_id']

        nodes = flow_chart['nodes']
        edges = flow_chart['edges']

        networkx_obj = reactflow_to_networkx(nodes, edges)
        topology = list(networkx_obj['topological_sort']) # topological ordering of the nodes

        # save the topological order of each node
        topology_order_by_node_serial = {}
        for order in range(len(topology)):
            serial = topology[order]
            topology_order_by_node_serial[serial] = order

        node_by_serial = networkx_obj['get_node_by_serial']() # node dictionary { node_serial --> node }
        node_serial_by_id = networkx_obj['get_node_serial_by_id']() # node dictionary { node_id --> node }
        DG = networkx_obj['DG'] # networkx representation of the graph
        edge_info = networkx_obj['edgeInfo']

        print('topology:', topology)

        print('\nnode serial --> node id')
        print('-----------------------')
        for id, serial in node_serial_by_id.items():
            print(serial, ' -->', id)

        preprocess_graph(DG=DG, edge_info=edge_info, node_by_serial=node_by_serial)
        print('special cmd flows:', json.dumps(flows.all_node_data, indent=2))
        remove_flows_from_topology(flows, topology)

        print("preprocessing complete")
        print("\nstarting topological enqueuing")
        
        while len(topology) != 0:
            time.sleep(1)
            # print("\n\nScheduling next node\nTopological Order: ", topological_sorting)
            node_serial = topology.pop(0)
            node = node_by_serial[node_serial]
            # print('node:', node)
            cmd = node['cmd']
            func = getattr(globals()[cmd], cmd)
            ctrls = node['ctrls']
            job_id = node_id = node['id']
            previous_job_ids = get_previous_job_ids(DG=DG, node_serial=node_serial)

            print('enqueuing ', node_serial, 'previous job ids', previous_job_ids, "new topology: ", topology)
            
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
                job_result = wait_for_job(job_id)

                for direction_ in get_next_directions(job_result):
                    direction = direction_.lower()
                    nodes_to_enqueue = flows.get_flow(node_id, direction)
                    topology = nodes_to_enqueue + topology

                    print(
                        F" adding direction({direction}) nodes", nodes_to_enqueue,
                        'to topology, after state:', topology
                        )

                for next_node_id in get_next_nodes(job_result):
                    next_node_serial = node_serial_by_id[next_node_id]
                    nodes_to_enqueue = [next_node_serial] 
                    topology = nodes_to_enqueue + topology

                    print(
                        F" adding node", nodes_to_enqueue,
                        'to topology, after state:', topology
                        )      

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
        if job_status == 'finished' or job_status == 'failed':
            job_result = job.result
            break
    return job_result


def notify_jobset_finished(jobset_id, my_job_id):
    job_service.redis_dao.remove_item_from_list('{}_watch'.format(jobset_id), my_job_id)

def preprocess_graph(DG, edge_info, node_by_serial):
    print('\npre-processing the graph')
    global flows, graph, topology
    graph = Graph(DG, edge_info)
    flows = find_flows(graph, node_by_serial, ["CONDITIONAL", "LOOP"])
    apply_topology(flows, topology)


    

   