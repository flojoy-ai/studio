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


def get_port():
    try:
        p = dotenv_values('.env')['REACT_APP_BACKEND_PORT']
    except Exception:
        p = '8000'
    return p


def send_to_socket(data):
    requests.post('http://localhost:' + get_port() +
                '/worker_response', json=json.dumps(data))


class FlowScheduler:
    def __init__(self) -> None:
        self.job_service = JobService('flojoy')
        self.topology_order_by_node_serial = {}
        self.topology = []
        self.node_serial_by_id = {}
        self.graph: Graph = None
        self.flows: Flows = None
        self.job_run_count = {}
        print('track')


    def run(self, **kwargs):
        print('track 2')

        jobset_id = kwargs.get('jobsetId', None)
        print('\nrunning flojoy for jobset id: ', jobset_id)
        
        try:
            flow_chart = kwargs['fc']
            flojoy_watch_job_id = kwargs['flojoy_watch_job_id']
            print('flojoy_watch_job_id:', flojoy_watch_job_id)

            nodes = flow_chart['nodes']
            edges = flow_chart['edges']

            networkx_obj = reactflow_to_networkx(nodes, edges)
            self.topology = list(networkx_obj['topological_sort']) # topological ordering of the nodes

            # save the topological order of each node
            self.topology_order_by_node_serial = {}
            for order in range(len(self.topology)):
                serial = self.topology[order]
                self.topology_order_by_node_serial[serial] = order

            node_by_serial = networkx_obj['get_node_by_serial']() # node dictionary { node_serial --> node }
            self.node_serial_by_id = networkx_obj['get_node_serial_by_id']() # node dictionary { node_id --> node }
            DG = networkx_obj['DG'] # networkx representation of the self.graph
            edge_info = networkx_obj['edgeInfo']

            print('self.topology:', self.topology)

            print('\nnode serial --> node id')
            print('-----------------------')
            for id, serial in self.node_serial_by_id.items():
                print(serial, ' -->', id)

            self.preprocess_graph(DG=DG, edge_info=edge_info, node_by_serial=node_by_serial)
            print('special cmd flows:', json.dumps(self.flows.all_node_data, indent=2))
            remove_flows_from_topology(self.flows, self.topology)

            print("preprocessing complete")
            print("\nstarting topological enqueuing")

            

            while len(self.topology) != 0:
                # time.sleep(1)
                node_serial = self.topology.pop(0)
                node = node_by_serial[node_serial]
                cmd = node['cmd']
                func = getattr(globals()[cmd], cmd)
                ctrls = node['ctrls']
                job_id = node_id = node['id']
                previous_job_ids = self.get_previous_job_ids(node_serial)

                print('enqueuing ', node_serial, 'previous job ids', previous_job_ids, "new self.topology: ", self.topology)
                
                next_job_id, _ = self.job_service.enqueue_job(
                    func=func,
                    jobset_id=jobset_id,
                    job_id=job_id,
                    previous_job_ids=previous_job_ids,
                    ctrls=ctrls
                )
                print('next_job_id:', next_job_id)
                self.job_service.add_job(job_id=next_job_id, jobset_id=jobset_id)

                job_result = self.wait_for_job(next_job_id)

                self.process_special_instructions(node_id, job_result)      

            self.notify_jobset_finished(jobset_id, flojoy_watch_job_id)
            return
        except Exception:
            self.send_to_socket({
                'jobsetId': jobset_id,
                'SYSTEM_STATUS': 'Failed to run Flowchart script on worker... ',
            })
            print('Watch.py run error: ', Exception, traceback.format_exc())

    def get_previous_job_ids(self, node_serial):
        previous_job_ids = self.graph.get_previous_job_ids(node_serial=node_serial)
        pids = []

        # find the latest runs of these jobs
        for pid in previous_job_ids:
            job = self.job_service.fetch_job(pid)
            if job is None:
                pids.append(pid + '___1')
                continue
            meta = job.get_meta()
            pids.append(pid + '___' + str(meta.get('run', 1)))

        return pids

    def process_special_instructions(self, node_id, job_result):
        '''
        process special instructions to scheduler
        '''
        
        for direction_ in get_next_directions(job_result):
            direction = direction_.lower()
            nodes_to_enqueue = self.flows.get_flow(node_id, direction)
            self.topology = nodes_to_enqueue + self.topology

            print(
                F" adding direction({direction}) nodes", nodes_to_enqueue,
                'to self.topology, after state:', self.topology
            )

        for next_node_id in get_next_nodes(job_result):
            next_node_serial = self.node_serial_by_id[next_node_id]
            nodes_to_enqueue = [next_node_serial] 
            self.topology = nodes_to_enqueue + self.topology

            print(
                F" adding node", nodes_to_enqueue,
                'to self.topology, after state:', self.topology
            )

    def wait_for_job(self, job_id):
        while True:
            time.sleep(.01)
            job = self.job_service.fetch_job(job_id=job_id)
            job_status = job.get_status()
            # print('wait for job:', job_id, 'job_status:', job_status)
            if job_status == 'finished' or job_status == 'failed':
                job_result = job.result
                break
        return job_result


    def notify_jobset_finished(self, jobset_id, my_job_id):
        self.job_service.redis_dao.remove_item_from_list('{}_watch'.format(jobset_id), my_job_id)

    def preprocess_graph(self, DG, edge_info, node_by_serial):
        print('\npre-processing the self.graph')
        self.flows, self.graph, self.topology
        self.graph = Graph(DG, edge_info)
        self.flows = find_flows(self.graph, node_by_serial, ["CONDITIONAL", "LOOP"])
        apply_topology(self.flows, self.topology)


        
def run(**kwargs):
    print('in run')
    FlowScheduler().run(**kwargs)