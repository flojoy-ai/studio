import time
from flojoy import reactflow_to_networkx, get_next_directions, get_next_nodes
import sys
import os
import json
import yaml
import traceback
import warnings
import matplotlib.cbook
import requests
from dotenv import dotenv_values


warnings.filterwarnings("ignore", category=matplotlib.cbook.mplDeprecation)

dir_path = os.path.dirname(os.path.realpath(__file__))
sys.path.append(os.path.abspath(os.path.join(dir_path, os.pardir)))

from services.job_service import JobService
from utils.flow_utils import find_flows, apply_topology, gather_all_flow_nodes
from utils.flows import Flows
from utils.graph import Graph
from utils.jobqueue import JobQueue


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
    def __init__(self, **kwargs) -> None:
        self.scheduler_job_id = kwargs['scheduler_job_id']
        self.jobset_id = kwargs.get('jobsetId', None)
        self.flow_chart = kwargs['fc']

        self.jobq = JobQueue(self.jobset_id)
        self.graph: Graph = None
        self.flows: Flows = None

        self.job_service = JobService('flojoy')

    def run_topological_sorting(self):
        self.networkx_obj = reactflow_to_networkx(
            self.flow_chart['nodes'], self.flow_chart['edges'])

        # networkx representation of the self.graph
        self.DG = self.networkx_obj['DG']
        self.edge_info = self.networkx_obj['edgeInfo']

        # # node_serial --> node
        self.node_by_serial = self.networkx_obj['node_by_serial']
        # # node_id --> node
        self.node_by_id = self.networkx_obj['node_by_id']
        # # node_id --> node_serial
        self.node_id_by_serial = self.networkx_obj['node_id_by_serial']
        # # node_serial --> node_id
        self.node_serial_by_id = self.networkx_obj['node_serial_by_id']
        

        # topological ordering of the nodes
        self.sorted_job_ids = list(self.networkx_obj['sorted_job_ids'])
        
        print('\nnode serial --> node id')
        print('-----------------------')
        for serial, id in self.node_id_by_serial.items():
            print(serial, ' -->', id)

    def run(self):        
        print('\nrunning flojoy for jobset id: ', self.jobset_id,
              'scheduler_job_id:', self.scheduler_job_id)

        try:
            self.preprocess_graph()

            print("\nstarting topological enqueuing")
            while self.jobq.has_next():
                job = self.jobq.pop_job()
                func, ctrls = self.get_job_data(job.job_id)

                print(
                    '\nenqueuing ', job.iteration_id,
                    'dependency job ids', job.dependency_iteration_ids,
                    "\ntopology after state: "
                 )

                self.jobq.log_state()

                self.job_service.enqueue_job(
                    func=func,
                    jobset_id=self.jobset_id,
                    job_id=job.job_id,
                    iteration_id=job.iteration_id,
                    previous_job_ids=job.dependency_iteration_ids,
                    ctrls=ctrls
                )

                job_result = self.wait_for_job(job.iteration_id)

                self.process_special_instructions(job.job_id, job_result)

            self.notify_jobset_finished()
            print('jobset', self.jobset_id, 'finished successfully')
            return
        except Exception:
            print('Watch.py run error: ', Exception, traceback.format_exc())
            self.send_to_socket({
                'jobsetId': self.jobset_id,
                'SYSTEM_STATUS': 'Failed to run Flowchart script on worker... ',
            })

    def preprocess_graph(self):
        print('\npre-processing the flow chart')
        
        # run topological sorting
        self.run_topological_sorting()
        self.graph = Graph(self.DG, self.edge_info)
        
        # add the nodes to jobq in their topological order
        self.add_node_ids_to_jobq(self.sorted_job_ids)

        print('topology:', self.jobq.get_job_ids())
        

        # find the conditional flows/nodes to remove from jobq
        self.flows = find_flows(
            self.graph,
            self.node_by_serial,
            ["CONDITIONAL", "LOOP"]
        )
        apply_topology(self.flows, self.jobq.get_job_ids())

        print('special cmd flows:', json.dumps(
            self.flows.all_node_data, indent=2))

        # remove all flows that will be conditionally executed
        print('removing flows from jobq, before state:', self.jobq.get_job_ids())
        conditional_node_ids = gather_all_flow_nodes(self.flows)
        print('conditional node ids:', conditional_node_ids)
        for node_id in conditional_node_ids:
            self.jobq.remove(node_id)
        print('removing flows from jobq, after state:', self.jobq.get_job_ids())


        print("preprocessing complete")

    def get_job_data(self, job_id):
        node = self.node_by_id[job_id]
        cmd = node['cmd']
        func = getattr(globals()[cmd], cmd)
        ctrls = node['ctrls']
        return func, ctrls


    def process_special_instructions(self, node_id, job_result):
        '''
        process special instructions to scheduler
        '''

        node_ids_to_add = []
        
        # process instruction to flow through specified directions
        for direction_ in get_next_directions(job_result):
            direction = direction_.lower()
            node_ids_to_add += self.flows.get_flow(node_id, direction)
            print(
                F" adding direction({direction}) nodes", node_ids_to_add,
                'to job queue'
            )

        # process instruction to flow to specified nodes
        next_nodes = get_next_nodes(job_result)
        if next_nodes is not None and len(next_nodes) > 0:
            print(F" adding nodes", next_nodes, 'to job queue')
            node_ids_to_add += next_nodes

        print('node_ids_to_add:', node_ids_to_add)

        if len(node_ids_to_add) > 0:
            self.add_node_ids_to_jobq(node_ids_to_add)
        

    def add_node_ids_to_jobq(self, node_ids):
        nodes_to_enqueue = list(map(lambda node_id: (node_id, self.node_serial_by_id[node_id]), node_ids))
        for job_id, node_serial in nodes_to_enqueue:
            self.add_job_to_jobq(node_serial, job_id)

    def add_job_to_jobq(self, node_serial, job_id):
        prev_job_ids = self.graph.get_previous_job_ids(node_serial)
        self.jobq.add_job(job_id, prev_job_ids)


    def wait_for_job(self, job_id):
        print('waiting for job to complete:', job_id)
        while True:
            time.sleep(.01)
            job = self.job_service.fetch_job(job_id=job_id)
            job_status = job.get_status()
            # print('wait for job:', job_id, 'job_status:', job_status)
            if job_status == 'finished' or job_status == 'failed':
                print('finished waiting for job:', job_id, 'status:', job_status)
                time.sleep(.7)
                job_result = job.result
                break
        return job_result

    def notify_jobset_finished(self):
        self.job_service.redis_dao.remove_item_from_list(
            F'{self.jobset_id}_watch', self.scheduler_job_id
        )


def run(**kwargs):
    print('in run')
    FlowScheduler(**kwargs).run()
