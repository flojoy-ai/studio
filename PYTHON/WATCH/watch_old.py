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
from utils.signals import Signals


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

stream = open("STATUS_CODES.yml", "r", encoding="utf-8")
STATUS_CODES = yaml.safe_load(stream)


def get_port():
    try:
        p = dotenv_values(".env")["REACT_APP_BACKEND_PORT"]
    except Exception:
        p = "8000"
    return p


def send_to_socket(data):
    requests.post(
        "http://localhost:" + get_port() + "/worker_response", json=json.dumps(data)
    )


class FlowScheduler:
    def __init__(self, **kwargs) -> None:
        self.scheduler_job_id = kwargs["scheduler_job_id"]
        self.jobset_id = kwargs.get("jobsetId", None)
        self.flow_chart = kwargs["fc"]

        self.jobq = JobQueue(self.jobset_id)
        self.graph: Graph = None
        self.flows: Flows = None
        self.signals: Signals = Signals()

        self.job_service = JobService("flojoy")

    def run(self):
        """
        # notes on signals
        - when a node with special flow is being executed (enqueued),
          - system should update the signal dependency of all its childs of all directions to it's next version
          - not only that, all special childs themselve have to let their child know to wait for its next version
          - update for only those nodes which are already in jobq

        - plus, when a node is being added to jobq, it should use the latest versions of its signals

        - then, when a job is popped from jobq, all its signals should be in ON status, otherwise skip it .. NO-OP


        ## Alternatively, whenever a node with multiple outputs has completed its execution,
        - system should add at the top [nodes of the chosen gate] + [all child nodes which are not among the childs of the chosen gate]
        - there shouldn't be at anytime two instances of a job in the jobq

        - in this system, no node should be removed from the jobq
        - there's no need for signals, basically a node will not be executed until the first run of its dependencies or the latest run of its
        dependencies

        ## Alternatively,
        - after the flows are calculated, for each flow add its originating node as a signal dependency to all its childs
          - we could use dfs to find all its childs
          - or, we could modify the algorithm that finds the flows to add the signals as well
        - when a child is popped from jobq, all its signal dependencies have to be in ON state, otherwise skip it
        - when a special node has finished executing, it will turn ON signals of some directions, and turn off the signals of other directions
        - CONS:
          - If we consider each node as special nodes, how does the algorithm behave?
            - After each node is complete it will turn on its signals
            -

        ## Alternatively,
        - whenever a node or direction is being reenqued,
        the topology algorithm should be re-run on its childs and the whole subtree tree should be added back
        - the jobq will maintain a tree
        - when a node got re-entry
            - it'll declare which directions or nodes it wants the execution to flow to next
            - a subtree will be added under this node for each of its signals
            - each subtree will include all the childs under the corresponding signal
            - the execution can be thought of as a single agent moving through the tree


        ## Alternatively,
        - we can have an end marker
        - after the special flows are added, sys will place an end marker job for the originating node
            - this is same as  lc but a node itself can create a loop
            - alternatively, if we allow to create cycles, then current algorithm of finding flows will have is as the last node of some child flows

        ## Alternatively,
            - when a node is being re-added to jobq, ask all its childs to update its next iteration


        ## Alternatively, (works)
            - at the begininning of time,
                - add all childs in their topological order in jobq
            - note: nodes with multiple output gates will have one signal per gate
            - when a node with multiple output gates is popped from jobq
                - wait its execution
                - based on result sys will signal a subset of gates
                - for nodes that instruct to spawn a gate
                    - sys will add all its childs in topological order
                        - ques: what if a child is connected to a node that is connected to nodes outside of the bounds of the special node's gate
                            - ans: the mother node (e.g. loop) will not finish until all its childs are done
                                - when this child which is connected to external nodes is enqued,
                                it will depend on the latest plannned iteration of the external nodes
                - a node (e.g. loop) can instruct to have it reexecuted after all the childs of the newly spawned gate have finished
                    - it will add a special function as a job, and it will add a dependency to all the childs of the tree (we can optimize it but later)
                - for the rest of the nodes, delete whole trees originating on them, anyone depending on them should not be executed


            - when a node is popped from jobq,

                - check all signals are on
                - if not der it at the end of


        ## alternatively,
            - when adding flow into jobq, don't add it if all its signals are not ready
            - a spawning node should update all its childs to use the latest signals of its special childs


        ## alternatively,
            - when adding flow into jobq, don't add it if all its signals are not ready
            - when a node with multiple branch is being added into jobq, turn off its signal
            - at beginning of time,
                - all nodes with multiple gates should add themselves as signals to all their childs
                    - use dfs,
                        - just aggregate the signals as we go down in depth,
                        - assign signals at the beginning of visiting a child


        # Alternatively, with a complete different paradigm: agent based modeling (preferred)
        - sys will maintain the graph the nodes and their dependencies

        on node finish:
        - when a node finishes its execution, an event will be fired, which will remove its outgoing edges from the graph
        - then it will spawn a work to run the scheduler

        on scheduler:
        - check which nodes in the graph have zero incoming edges
        - spawn workers to execute them

        - any node can change the graph with some utility functions
            - spawn a tree
            - spawn a completely new tree (evolving graph)

        - how to implement loop?
            - it can mark a gate that it want's to listen to its finish event
            - then the on finish handler will be called, which will instruct to spawn the next branch

        - can we support cycle?
            - basically the node that receives the cyclic incoming edge, it will have to be spawned again with all its subtrees

        - graph characteristics
            - there's only single instance of each node and edge at any given time

        - how does it solve the problem of maintaining iterations?
            - anytime a new graph is spawned all the childs whill have their deps re-connected
            - which means now every child will wait for the latest data from the very source
            - even if there were childs executed in previous runs, now they will not progress
            until all their deps are executed
            - but any child with some external deps if those were already executed or not they will be untouched

        ### PROS
        - will work in cloud with simple queues like SQS and db like DynamoDb
        - much simplement implementation and uses very simple and small number of concepts

        ### CONS
        - will have to re-implement most of the arch

        """
        print(
            "\nrunning flojoy for jobset id: ",
            self.jobset_id,
            "scheduler_job_id:",
            self.scheduler_job_id,
        )

        try:
            self.preprocess_graph()

            print("\nstarting topological enqueuing")
            while self.jobq.has_next():
                job = self.jobq.pop_job()
                if self.is_special_flow(job):
                    self.update_child_signals(job)

                # if all the dependent signals haven't yet completed, just skip it
                # the paths corresponding to these off signals will add it back to jobq
                if self.signals.are_signals_on(job):
                    print("skipping job:", job.job_id, "off_signals:", off_signals)
                    continue

                func, ctrls = self.get_job_data(job.job_id)

                print(
                    "\nenqueuing ",
                    job.iteration_id,
                    "dependency job ids",
                    job.dependency_iteration_ids,
                    "\ntopology after state: ",
                )

                self.jobq.log_state()

                self.job_service.enqueue_job(
                    func=func,
                    jobset_id=self.jobset_id,
                    job_id=job.job_id,
                    iteration_id=job.iteration_id,
                    previous_job_ids=job.dependency_iteration_ids,
                    ctrls=ctrls,
                )

                job_result = self.wait_for_job(job.iteration_id)

                self.process_special_instructions(job.job_id, job_result)

            self.notify_jobset_finished()
            print("jobset", self.jobset_id, "finished successfully")
            return
        except Exception:
            print("Watch.py run error: ", Exception, traceback.format_exc())
            self.send_to_socket(
                {
                    "jobsetId": self.jobset_id,
                    "SYSTEM_STATUS": "Failed to run Flowchart script on worker... ",
                }
            )

    def run_topological_sorting(self):
        self.networkx_obj = reactflow_to_networkx(
            self.flow_chart["nodes"], self.flow_chart["edges"]
        )

        # networkx representation of the self.graph
        self.DG = self.networkx_obj["DG"]
        self.edge_info = self.networkx_obj["edgeInfo"]

        # # node_serial --> node
        self.node_by_serial = self.networkx_obj["node_by_serial"]
        # # node_id --> node
        self.node_by_id = self.networkx_obj["node_by_id"]
        # # node_id --> node_serial
        self.node_id_by_serial = self.networkx_obj["node_id_by_serial"]
        # # node_serial --> node_id
        self.node_serial_by_id = self.networkx_obj["node_serial_by_id"]

        # topological ordering of the nodes
        self.sorted_job_ids = list(self.networkx_obj["sorted_job_ids"])

        print("\nnode serial --> node id")
        print("-----------------------")
        for serial, id in self.node_id_by_serial.items():
            print(serial, " -->", id)

    def update_child_signals(self, node_id, direction, child_id):
        self.signals.update_child_signals(child_id, node_id, direction)

    def is_special_flow(self, job):
        return job.job_id in self.flows.all_node_data

    def preprocess_graph(self):
        print("\npre-processing the flow chart")

        self.run_topological_sorting()
        self.graph = Graph(self.DG, self.edge_info)

        # add the nodes to jobq in their topological order
        nodes_to_add = [(node_id, []) for node_id in self.sorted_job_ids]
        self.add_node_ids_to_jobq(nodes_to_add)

        print("topology:", self.jobq.get_job_ids())

        # find the conditional flows/nodes
        self.flows = find_flows(
            self.graph, self.node_by_serial, ["CONDITIONAL", "LOOP"]
        )

        # fix the topology order for all special cmd childs
        apply_topology(self.flows, self.jobq.get_job_ids())

        print("special cmd flows:", self.flows)

        # remove all special flows because they will be executed conditionally
        self.remove_conditional_nodes()

        # update signals for all childs of all flows
        for node_id, flow in self.flows.all_node_data.items():
            for direction, child_ids in flow:
                for child_id in child_ids:
                    self.update_child_signals(node_id, direction, child_id)

        print("preprocessing complete")

    def remove_conditional_nodes(self):
        print("removing flows from jobq, before state:", self.jobq.get_job_ids())

        conditional_node_ids = gather_all_flow_nodes(self.flows)

        print("conditional node ids:", conditional_node_ids)
        for node_id in conditional_node_ids:
            self.jobq.remove(node_id)

        print("removing flows from jobq, after state:", self.jobq.get_job_ids())

    def process_special_instructions(self, node_id, job_result):
        """
        process special instructions to scheduler
        """

        nodes_to_add = []

        # process instruction to flow through specified directions
        for direction_ in get_next_directions(job_result):
            direction = direction_.lower()

            # find the latest iteration of this signal (node_id, direction)
            signal_id = self.get_latest_signal(node_id, direction)

            # add the childs of this flow into jobq
            child_ids = self.flows.get_flow(node_id, direction)
            nodes_to_add += [(child_id, [signal_id]) for child_id in child_ids]
            print(
                f" adding direction({direction}) nodes",
                json.dumps(nodes_to_add, indent=2),
                "to job queue",
            )

        # process instruction to flow to specified nodes
        next_nodes = get_next_nodes(job_result)
        if next_nodes is not None and len(next_nodes) > 0:
            print(f" adding nodes to job queue:", json.dumps(next_nodes, indent=2))
            nodes_to_add += [(node_id, []) for node_id in next_nodes]

        print("node_ids_to_add:", nodes_to_add)

        if len(nodes_to_add) > 0:
            self.add_node_ids_to_jobq(nodes_to_add)

    def add_node_ids_to_jobq(self, node_data):
        nodes_to_add = [
            (node_id, self.node_serial_by_id[node_id], signal_ids)
            for node_id, signal_ids in node_data
        ]
        for job_id, node_serial, signal_dependencies in nodes_to_add:
            self.add_job_to_jobq(node_serial, job_id, signal_dependencies)

    def add_job_to_jobq(self, node_serial, job_id, signal_dependencies):
        prev_job_ids = self.graph.get_previous_job_ids(node_serial)
        self.jobq.add_job(job_id, prev_job_ids, signal_dependencies)

    def wait_for_job(self, job_id):
        print("waiting for job to complete:", job_id)
        while True:
            time.sleep(0.01)
            job = self.job_service.fetch_job(job_id=job_id)
            job_status = job.get_status()
            # print('wait for job:', job_id, 'job_status:', job_status)
            if job_status == "finished" or job_status == "failed":
                print("finished waiting for job:", job_id, "status:", job_status)
                time.sleep(0.7)
                job_result = job.result
                break
        return job_result

    def notify_jobset_finished(self):
        self.job_service.redis_dao.remove_item_from_list(
            f"{self.jobset_id}_watch", self.scheduler_job_id
        )

    def get_job_data(self, job_id):
        node = self.node_by_id[job_id]
        cmd = node["cmd"]
        func = getattr(globals()[cmd], cmd)
        ctrls = node["ctrls"]
        return func, ctrls

    def get_latest_signal(self, node_id, direction):
        signal_iteration = self.signal_iterations.get((node_id, direction), 1)
        return "signal__" + node_id + "__" + direction + "__" + str(signal_iteration)

    def get_next_signal_iteration(self, node_id, direction):
        next_iteration = 1 + self.signal_iterations.get((node_id, direction), 0)
        self.signal_iterations[(node_id, direction)] = next_iteration
        return "signal__" + node_id + "__" + direction + "__" + str(next_iteration)


def run(**kwargs):
    print("in run")
    FlowScheduler(**kwargs).run()
