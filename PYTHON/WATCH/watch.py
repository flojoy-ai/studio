
import json
import os
import sys
import time
import traceback
import warnings

import matplotlib.cbook
import networkx as nx
import yaml

from flojoy import get_next_directions, get_next_nodes


warnings.filterwarnings("ignore", category=matplotlib.cbook.mplDeprecation)

dir_path = os.path.dirname(os.path.realpath(__file__))
sys.path.append(os.path.abspath(os.path.join(dir_path, os.pardir)))


from FUNCTIONS.ARITHMETIC import *
from FUNCTIONS.ARRAY_AND_MATRIX import *
from FUNCTIONS.CONDITIONALS import *
from FUNCTIONS.LOADERS import *
from FUNCTIONS.LOOPS import *
from FUNCTIONS.SIGNAL_PROCESSING import *
from FUNCTIONS.SIMULATIONS import *
from FUNCTIONS.TIMERS import *
from FUNCTIONS.VISORS import *
from FUNCTIONS.TERMINATORS import *
from services.job_service import JobService
from utils.topology import Topology

from common.CONSTANTS import KEY_ALL_JOBEST_IDS


stream = open('STATUS_CODES.yml', 'r')
STATUS_CODES = yaml.safe_load(stream)


class FlowScheduler:
    def __init__(self, **kwargs) -> None:
        self.scheduler_job_id = kwargs['scheduler_job_id']
        self.jobset_id = kwargs.get('jobsetId', None)
        self.flow_chart = kwargs['fc']

        self.job_service = JobService('flojoy')

    def run(self):
        print('\nrun jobset:', self.jobset_id)
        self.nx_graph = reactflow_to_networkx(self.flow_chart['nodes'], self.flow_chart['edges'])
        self.topology = Topology(graph=self.nx_graph)
        self.topology.print_id_to_label_mapping()
        self.topology.print_graph()
        self.topology.collect_ready_jobs()

        num_times_waited_for_new_jobs = 0
        wait_time_for_new_jobs = 0.1
        wait_time_multiplier = 2
        max_wait_time = 10

        while not self.topology.finished():

            print('\nnext wave')
            # self.topology.print_graph()

            try:
                
                self.topology.collect_ready_jobs()
                next_jobs = self.topology.next_jobs()
                
                if len(next_jobs) == 0:
                    wait_time_for_new_jobs = wait_time_for_new_jobs * pow(wait_time_multiplier, num_times_waited_for_new_jobs)
                    wait_time_for_new_jobs = min(wait_time_for_new_jobs, max_wait_time)
                    print(F'no new jobs to execute, sleeping for {wait_time_for_new_jobs} sec')
                    time.sleep(wait_time_for_new_jobs)
                    num_times_waited_for_new_jobs += 1
                    continue

                # reset wait count
                num_times_waited_for_new_jobs = 0

                self.topology.print_jobq('ready ')

                for job_id in next_jobs:                    
                    self.run_job(job_id)
                    
                print('waiting on jobs enqueued')
                for job_id in next_jobs:
                    job_result, success = self.wait_for_job(job_id)
                    self.process_job_result(job_id, job_result, success)

                self.topology.clear_jobq()

            except Exception as e:

                self.topology.print_graph('exception occurred in scheduler, current working graph:')
                print(traceback.format_exc())
                raise e

        # jobset finished 
        self.topology.print_graph()
        self.notify_jobset_finished()
        self.job_service.reset(self.flow_chart.get('nodes',[]))
        print('finished proceessing jobset', self.jobset_id, '\n')


    def process_job_result(self, job_id, job_result, success):
        '''
        process special instructions to scheduler
        '''

        if not success:
            self.topology.mark_job_failure(job_id)
            return

        # process instruction to flow through specified directions
        for direction_ in get_next_directions(job_result):
            direction = direction_.lower()
            self.topology.mark_job_success(job_id, direction)

        # process instruction to flow to specified nodes
        nodes_to_add = []
        next_nodes = get_next_nodes(job_result)
        if next_nodes is not None:
            nodes_to_add += [node_id for node_id in next_nodes]

        if len(nodes_to_add) > 0:
            print(F"  + adding nodes to graph:", [self.topology.get_label(n_id, original=True) for n_id in nodes_to_add])

        for node_id in nodes_to_add:
            self.topology.restart(node_id)

    def run_job(self, job_id):

        node = self.nx_graph.nodes[job_id]
        cmd = node['cmd']
        func = getattr(globals()[cmd], cmd)
        dependencies = self.topology.get_job_dependencies(job_id, original=True)
        
        print(
            ' enqueue job:',
            self.topology.get_label(job_id),
            'dependencies:',
            [self.topology.get_label(dep_id, original=True) for dep_id in dependencies]
        )
        
        self.job_service.enqueue_job(
            func=func,
            jobset_id=self.jobset_id,
            job_id=job_id,
            iteration_id=job_id,
            ctrls=node['ctrls'],
            previous_job_ids=[],
            input_job_ids=dependencies
        )
    
    def wait_for_job(self, job_id):
        print(' waiting for job:', self.topology.get_label(job_id))
        
        while True:
            time.sleep(.01)
    
            job = self.job_service.fetch_job(job_id=job_id)
            job_status = job.get_status()
    
            if job_status in ['finished', 'failed']:
                job_result = job.result
                success = True if job_status == 'finished' else False
                print('  job:', self.topology.get_label(job_id), 'status:', job_status)
                break
        
        return job_result, success

    
    def notify_jobset_finished(self):
        self.job_service.redis_dao.remove_item_from_list(
            F'{self.jobset_id}_watch', self.scheduler_job_id
        )

    def print_flow_chart(self):
        print("nodes from FE:", json.dumps(self.flow_chart['nodes'], indent=2),
              "\nedges from FE:", json.dumps(self.flow_chart['edges'], indent=2))

        

def reactflow_to_networkx(elems, edges):
    nx_graph: nx.DiGraph = nx.DiGraph()
    for i in range(len(elems)):
        el = elems[i]
        node_id = el['id']
        data = el['data']
        cmd = el['data']['func']
        ctrls = data['ctrls'] if 'ctrls' in data else {}
        inputs = data['inputs'] if 'inputs' in data else {}
        label = data['label'] if 'label' in data else {}
        nx_graph.add_node(
            node_id,
            pos=(el['position']['x'], el['position']['y']),
            id=el['id'],
            ctrls=ctrls,
            inputs=inputs,
            label=label,
            cmd=cmd
        )

    for i in range(len(edges)):
        e = edges[i]
        id = e['id']
        u = e['source']
        v = e['target']
        label = e['sourceHandle']
        nx_graph.add_edge(u, v, label=label, id=id)

    nx.draw(nx_graph, with_labels=True)

    return nx_graph

def run(**kwargs):
    try:
        FlowScheduler(**kwargs).run()
    except Exception:
        print('exception occured whilte running the flowchart')
        print(traceback.format_exc())
