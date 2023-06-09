from __future__ import annotations
import os
import sys
import traceback
import warnings

import matplotlib.cbook
import networkx as nx
from flojoy import get_next_directions, get_next_nodes


warnings.filterwarnings("ignore", category=matplotlib.cbook.mplDeprecation)

dir_path = os.path.dirname(os.path.realpath(__file__))
sys.path.append(os.path.abspath(os.path.join(dir_path, os.pardir)))

from node_sdk.small_memory import SmallMemory
from PYTHON.services.job_service import JobService
from utils.dynamic_module_import import get_module_func, create_map
from utils.topology import Topology


ENV_KEY_CI = "CI"
REDIS_KEY_TOPOLOGY = "__topology__"
REDIS_KEY_MAX_RUN_TIME = "__max_run_time__"
QUEUE_NAME_WORKERS = "flojoy"


class FlowScheduler:
    """
    FlowScheduler manages scheduling for flowchart jobs.
    It maintains its state in backend DB,
    and provides methods to schedule jobs that are ready, mark a job as finished.

    Note:
    Its methods are not thread safe.
    Which means if you call its methods in parallel,
    you won't get predictable behavior.
    But, its methods don't keep any unsaved states when they finish.
    """

    def __init__(
        self,
        jobset_id: str,
        fc: any | None = None,
        maximum_runtime_ms: int | None = None,
        persist_state: bool = False,
    ):
        """Constructor

        Parameters
        ----------
        jobset_id : str
                  This is a required parameter.
                  A unique id to track a flowchart's execution.
        fc : flowchart
            When fc (flowchart) is provided, it'll initiate its state with it and save its state in DB.
            When fc (flowchart) is not provided, it'll load the its state from DB.
        maximum_runtime_ms : int | None
            Maximum runtime of a node in milliseconds.
            The next run of the ready jobs are scheduled with this value as the maximum runtime.
            When this parameter is not provided,
            it'll use the value currently saved in DB. It'll default to 3000ms if a value is not found in DB.
            When fc parameter is provided, it interprets that as a whole new jobset run.
            In that case, if this parameter maximum_runtime_ms is omitted,
            it'll default to 3000ms without looking in DB.
        persist_state : bool
            Flag to indicate whether the scheduler state should be persisted in DB
        """

        self.is_ci = os.getenv(key=ENV_KEY_CI, default=False)
        print("is running in CI?", self.is_ci)

        self.jobset_id: str = jobset_id
        self.persist_state = persist_state
        if fc is not None:
            self.maximum_runtime_ms = (
                maximum_runtime_ms if maximum_runtime_ms is not None else 3000
            )
            self._init_jobset(fc)
            self.save_state()
        else:
            self.load_state()

        self.job_service = JobService(QUEUE_NAME_WORKERS, self.maximum_runtime_ms)

    def _init_jobset(self, fc) -> None:
        print("\nrun jobset:", self.jobset_id)

        self.nx_graph = _reactflow_to_networkx(fc["nodes"], fc["edges"])
        self.topology = Topology(graph=self.nx_graph)
        self.topology.print_id_to_label_mapping()
        self.topology.print_graph()

        print("finished constructing scheduler")

    def run_jobq(self):
        print("\nrun jobq")
        try:
            # self.topology.print_graph()
            self.topology.print_jobq("before collecting jobs current")
            self.topology.collect_ready_jobs()
            self.topology.print_jobq("ready ")
            while self.topology.has_next():
                next_job_id = self.topology.pop_job()
                self._enqueue_job(next_job_id)
            self.save_state()
        except Exception as e:
            self.topology.print_graph(
                "exception occurred in scheduler, current working graph:"
            )
            print(traceback.format_exc())
            raise e

    def handle_job_finished(self, job_id: str, jobset_id: str):
        print(
            f"handling job finished: {self.topology.get_label(job_id)} - jobset_id: {jobset_id}"
        )
        job_result, success = self._get_job_result(job_id)
        self._process_job_result(job_id, job_result, success)
        self.save_state()
        self.run_jobq()

    def save_state(self):
        if not self.persist_state:
            return
        print("saving scheduler state")
        topology_json = self.topology.to_json()
        SmallMemory().write_to_memory(self.jobset_id, REDIS_KEY_TOPOLOGY, topology_json)
        SmallMemory().write_to_memory(
            self.jobset_id, REDIS_KEY_MAX_RUN_TIME, str(self.maximum_runtime_ms)
        )
        print("scheduler state saved")

    def load_state(self):
        if not self.persist_state:
            return
        print("loading scheduler state")
        self.maximum_runtime_ms = int(
            SmallMemory().read_memory(self.jobset_id, REDIS_KEY_MAX_RUN_TIME)
        )
        topology_json = SmallMemory().read_memory(self.jobset_id, REDIS_KEY_TOPOLOGY)
        self.topology = Topology(None)
        self.topology.from_json(topology_json)
        print("scheduler state loaded")

    def _process_job_result(self, job_id, job_result, success):
        """
        process special instructions to scheduler
        """

        print(f"processing job result for: {self.topology.get_label(job_id)}")

        if not success:
            self.topology.mark_job_failure(job_id)
            return

        # process instruction to flow through specified directions
        self._flow_to_directions(job_id, job_result)

        # process instruction to flow to specified nodes
        self._flow_to_nodes(job_result)

    def _flow_to_directions(self, job_id, job_result):
        for direction_ in get_next_directions(job_result):
            self.topology.mark_job_success(job_id, direction_.lower())

    def _flow_to_nodes(self, job_result):
        nodes_to_add = get_next_nodes(job_result)

        if len(nodes_to_add) > 0:
            print(
                "  + adding nodes to graph:",
                [self.topology.get_label(n_id, original=True) for n_id in nodes_to_add],
            )

        for node_id in nodes_to_add:
            print("OVER HERE")
            self.topology.restart(node_id)

    def _get_job_result(self, job_id):
        job_result = None
        success = True
        job = self.job_service.fetch_job(job_id=job_id)
        print(f"get job result for job_id: {self.topology.get_label(job_id)}")
        if job:
            job_status = job.get_status()
            print(f"job_status: {job_status}")
            if job_status in ["finished", "failed"]:
                job_result = job.result
                success = True if job_status == "finished" else False
                print("  job:", self.topology.get_label(job_id), "status:", job_status)
        else:
            print(
                " Error: could not fetch result for job id:",
                self.topology.get_label(job_id),
            )
            return None, False
        return job_result, success

    def _enqueue_job(self, job_id):
        node = self.topology.working_graph.nodes[job_id]
        cmd = node["cmd"]
        func = get_module_func(cmd, cmd)
        if self.is_ci:
            try:
                cmd_mock = node["cmd"] + "_MOCK"
                func = get_module_func(cmd, cmd_mock)
            except Exception:
                pass

        dependencies = self.topology.get_job_dependencies(job_id, original=True)

        print(
            " enqueue job:",
            self.topology.get_label(job_id),
            "dependencies:",
            [self.topology.get_label(dep_id, original=True) for dep_id in dependencies],
        )

        self.job_service.enqueue_job(
            func=func,
            jobset_id=self.jobset_id,
            job_id=job_id,
            iteration_id=job_id,
            ctrls=node["ctrls"],
            previous_job_ids=[],
            input_job_ids=dependencies,
        )


def _reactflow_to_networkx(elems, edges):
    nx_graph: nx.DiGraph = nx.DiGraph()
    for i in range(len(elems)):
        el = elems[i]
        node_id = el["id"]
        data = el["data"]
        cmd = el["data"]["func"]

        ctrls = data["ctrls"] if "ctrls" in data else {}
        inputs = data["inputs"] if "inputs" in data else {}
        label = data["label"] if "label" in data else {}

        nx_graph.add_node(
            node_id,
            pos=(el["position"]["x"], el["position"]["y"]),
            id=el["id"],
            ctrls=ctrls,
            inputs=inputs,
            label=label,
            cmd=cmd,
        )

    for i in range(len(edges)):
        e = edges[i]
        _id = e["id"]
        u = e["source"]
        v = e["target"]
        label = e["sourceHandle"]
        nx_graph.add_edge(u, v, label=label, id=_id)

    return nx_graph


flowScheduler: FlowScheduler


def run_flowchart(**kwargs):
    print("\n\n\nrun_flowchart")
    global flowScheduler
    try:
        flowScheduler = FlowScheduler(**kwargs)
        flowScheduler.run_jobq()
        return flowScheduler
    except Exception:
        print("exception occurred while running the flowchart")
        print(traceback.format_exc())


def job_finished(**kwargs):
    global flowScheduler
    print("job_finished")
    try:
        flowScheduler.handle_job_finished(**kwargs)
        return flowScheduler
    except Exception:
        print("exception occurred while handling job finished, kwargs:", kwargs)
        print(traceback.format_exc())
