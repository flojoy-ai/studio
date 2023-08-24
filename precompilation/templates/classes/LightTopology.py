try:
    import ujson # micropython json equivalent
except ImportError:
    import json as ujson
from collections import deque
import time
from typing import Any, Callable, Dict, Tuple
from flojoy import get_next_directions

# NOTE FOR DEVELOPERS:
# DO NOT use type hints except on functions 

# TODO: switch to multigraph
class LightTopology:
    """
    Lighter version of the Topology class meant to run on micropython. Used for the precompilation process.
    Its purpose is to implement event-driven logic without
    asynchronous programming, and reduce the size of the precompiled script.
    For comments and documentation, see Topology class.
    """

    def __init__(
        self,
        graph,
        jobset_id: str,
        node_id_to_func: Dict[str, Callable[..., Any]],
        node_id_to_params: Dict[str, set] = dict(),
        is_ci: bool = False,
    ):
        self.working_graph = graph.copy()
        self.original_graph = graph.copy()
        self.loop_nodes = []
        self.queued_amt = 0 # added before self.queue, TODO remove this since we have queue queue length
        self.is_ci = is_ci
        self.jobset_id = jobset_id
        self.res_store = {}
        self.is_finished = False
        self.node_id_to_func = node_id_to_func
        self.node_id_to_params = node_id_to_params
        self.time_start = 0
        self.queue = [] # use regular list because deque is not supported in micropython

    def write_results(self):
        with open("results.json", "w") as f:
            f.write(ujson.dumps(self.res_store))

    def run(self):
        self.time_start = time.time()
        self.queue += self.get_initial_source_nodes()
        while (len(self.queue)):
            next_job = self.queue.pop(0)
            self.queue += self.run_job(next_job)
        return self

    def get_initial_source_nodes(self) -> list:
        next_jobs = []
        for job_id in self.working_graph.nodes:
            if self.original_graph.in_degree(job_id) == 0:
                self.queued_amt += 1
                next_jobs.append(job_id)
        return next_jobs

    def run_job(self, job_id: str) -> list:
        node = self.working_graph.nodes[job_id]
        previous_jobs = self.get_job_dependencies_with_label(
            job_id, original=True
        )
        params = self.node_id_to_params[job_id]
        job = {
            "node_id": job_id,
            "job_id": job_id,
            "jobset_id": self.jobset_id,
            "ctrls": node["ctrls"],
            "previous_jobs": previous_jobs,
            "function_parameters": params,
        }
        func = self.node_id_to_func[job_id]
        if func is None:
            raise ValueError("Function %s not found in imported functions" % job_id)
        if self.is_loop_node(job_id):
            self.loop_nodes.append(job_id)
        job_result = func(**job)
        print('ran job', job_id, 'with result', job_result)
        self.res_store[job_id] = job_result
        next_jobs = self.process_job_result(job_id, job_result)
        self.queued_amt += len(next_jobs)
        return next_jobs

    def get_outputs(self, job_id: str):
        out = self.working_graph.out_edges(job_id)
        return list(
            set(self.working_graph.get_edge_data(u, v)["label"] for (u, v) in out)
        )

    def get_edges_by_label(self, job_id: str, label: str) -> list:
        edges = self.working_graph.get_edges(job_id)
        edges = [(s, t, self.working_graph.get_edge_data(s, t)) for (s, t) in edges]
        edges = [
            (s, t, data) for (s, t, data) in edges if data.get("label", "") == label
        ]
        return edges

    def remove_dependency(self, job_id: str, succ_id: str):
        if self.working_graph.has_edge(job_id, succ_id):
            self.working_graph.remove_edge(job_id, succ_id)

    def remove_dependencies(self, job_id: str, label: str = "default"):
        edges = self.get_edges_by_label(job_id, label)
        for edge in edges:
            self.remove_dependency(edge[0], edge[1])

    def remove_edges_and_get_next(
        self, job_id: str, next_nodes: set, label_direction: str = "default"
    ):
        successors = list(self.working_graph.successors(job_id))
        self.remove_dependencies(job_id, label_direction)
        next_nodes = set()
        for d_id in successors:
            if self.working_graph.in_degree(d_id) == 0:
                next_nodes.add(d_id)
        return next_nodes

    def finish(self):
        print("took ", time.time() - self.time_start, " seconds")
        self.is_finished = True

    def restart(self, job_id: str):
        if self.loop_nodes:
            self.loop_nodes.pop()
        graph = self.original_graph
        sub_graph = graph.subgraph([job_id] + self.original_graph.descendants(job_id))
        original_edges = sub_graph.get_all_edges()
        original_edges = [
            (s, t, self.original_graph.get_edge_data(s, t)) for (s, t) in original_edges
        ]
        self.working_graph.add_edges_from(original_edges)

    def process_job_result(self, job_id: str, job_result) -> list:
        self.queued_amt -= 1
        next_nodes_from_dependencies = set()
        next_directions = get_next_directions(job_result)
        if not next_directions:
            next_directions = self.get_outputs(job_id)
        for direction_ in next_directions:
            direction = direction_.lower()
            if direction == "end" and self.loop_nodes:
                self.loop_nodes.pop()
            next_nodes = self.remove_edges_and_get_next(
                job_id, next_nodes_from_dependencies, direction
            )
            next_nodes_from_dependencies.update(next_nodes)
        loop_node = None
        if len(next_nodes_from_dependencies) == 0 and self.queued_amt == 0:
            if len(self.loop_nodes) == 0:
                self.finish()
            else:
                loop_node = self.loop_nodes[-1]
        if loop_node:
            self.restart(loop_node)
            next_nodes_from_dependencies.add(loop_node)
        return list(next_nodes_from_dependencies)

    def is_loop_node(self, job_id: str) -> bool:
        node = self.original_graph.nodes[job_id]
        return bool(node and node["cmd"] == "LOOP")

    def get_job_dependencies_with_label(
        self, job_id: str, original: bool = True
    ) -> list:
        graph = self.get_graph(original)
        try:
            deps = []
            for prev_job_id in list(graph.predecessors(job_id)):
                input_name, multiple = self.get_input_info(
                    prev_job_id, job_id, original
                )
                deps.append(
                    {
                        "job_id": prev_job_id,
                        "input_name": input_name,
                        "multiple": multiple,
                        "edge": graph.get_edge_data(prev_job_id, job_id).get(
                            "label", ""
                        ),
                    }
                )
            return deps
        except Exception:
            return []

    def get_input_info(
        self, source_job_id: str, target_job_id: str, original: bool = False
    ) -> Tuple[str, bool]:
        graph = self.get_graph(original)
        edge_data = graph.get_edge_data(source_job_id, target_job_id)
        target_label = ""
        multiple = False
        if edge_data:
            target_label = edge_data.get("target_label", "")
            multiple = edge_data.get("multiple", False)

        return target_label, multiple

    def get_graph(self, original: bool):
        return self.original_graph if original else self.working_graph
