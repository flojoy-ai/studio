from copy import deepcopy
from typing import Any, Callable, Dict, Tuple
from flojoy import get_next_directions
import networkx as nx

class LightTopology:
    '''
    Lighter version of the Topology class. Used for the precompilation process. 
    Its purpose is to implement event-driven logic without 
    asynchronous programming, and reduce the size of the precompiled script.
    For comments and documentation, see Topology class.
    '''
    def __init__(
            self, 
            graph: nx.DiGraph,
            jobset_id: str,
            node_id_to_func: Dict[str, Callable[..., Any]],
            cleanup_func: Callable[..., Any],
            is_ci: bool = False,
    ):
        self.working_graph = deepcopy(graph)
        self.original_graph = deepcopy(graph)
        self.loop_nodes = (
            list()
        ) 
        self.is_ci = is_ci
        self.cleanup_func = cleanup_func
        self.jobset_id = jobset_id
        self.res_store = {}
        self.is_finished = False
        self.node_id_to_func = node_id_to_func

    def run(self) -> None:
        next_jobs = self.get_initial_source_nodes()
        for next_job in next_jobs:
            self.run_job(next_job)
    
    def get_initial_source_nodes(self) -> list[str]:
        next_jobs: list[str] = []
        for job_id in self.working_graph.nodes:
            if (
                self.original_graph.in_degree(job_id) == 0
            ):
                next_jobs.append(job_id)
        return next_jobs

    def run_job(self, job_id: str):
        node: dict = self.working_graph.nodes[job_id]
        previous_jobs: list[dict] = self.get_job_dependencies_with_label(job_id, original=True)
        job = { 
            'job_id':job_id,
            'jobset_id':self.jobset_id,
            'iteration_id':job_id,
            'ctrls': node["ctrls"],
            'previous_jobs':previous_jobs,
        }
        func = self.node_id_to_func.get(job_id, None)
        if func is None:
            raise ValueError(f"Function {job_id} not found in imported functions")
        if self.is_loop_node(job_id):
            self.loop_nodes.append(job_id)
        result : dict = func(**job)
        job_result = result["NODE_RESULTS"].get("result", None)
        if "FAILED_NODES" in result:
            job_id = result.get("FAILED_NODES", "")
            self.process_job_result(job_id, None, success=False)
        next_jobs = self.process_job_result(job_id, job_result, success=True)
        if next_jobs is None:
            return
        for next_job in next_jobs:
            self.run_job(next_job)

    def get_outputs(self, job_id: str):
        out = self.working_graph.out_edges(job_id)
        return list(
            set(self.working_graph.get_edge_data(u, v)["label"] for (u, v) in out)
        )
    
    def get_edges_by_label(self, job_id: str, label: str) -> list[tuple[str, Any, Any]]:
        edges = self.working_graph.edges(job_id)
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
        self, job_id: str, label_direction: str, next_nodes: set[str]
    ):
        successors: list[str] = list(self.working_graph.successors(job_id))
        self.remove_dependencies(job_id, label_direction)
        for d_id in successors:
            if self.working_graph.in_degree(d_id) == 0:
                next_nodes.add(d_id)

    def mark_job_success(
        self, job_id: str, next_nodes: set[str], label: str = "default"
    ):
        self.remove_edges_and_get_next(job_id, label, next_nodes)

    def finish(self):
        self.cancelled = True
        self.cleanup_func(self.is_finished)

    def restart(self, job_id: str):
        if self.loop_nodes:
            self.loop_nodes.pop()
        graph = self.original_graph
        sub_graph = graph.subgraph([job_id] + list(nx.descendants(graph, job_id)))
        original_edges = sub_graph.edges
        original_edges = [
            (s, t, self.original_graph.get_edge_data(s, t)) for (s, t) in original_edges
        ]
        original_nodes = sub_graph.nodes
        self.working_graph.add_nodes_from((n, graph.nodes[n]) for n in original_nodes)
        self.working_graph.add_edges_from(original_edges)

    def process_job_result(
            self, job_id: str, job_result, success: bool
    ) -> list[str] | None:
        if not success:
            self.finish()
            return None
        next_nodes_from_dependencies = set()
        next_directions = get_next_directions(job_result)
        if not next_directions:
            next_directions = self.get_outputs(job_id)
        for direction_ in next_directions:
            direction = direction_.lower()
            if direction == "end" and self.loop_nodes:
                self.loop_nodes.pop()
            self.mark_job_success(job_id, next_nodes_from_dependencies, direction)
        nodes_to_add = []
        if (
            self.working_graph.out_degree(job_id) == 0
            and not self.loop_nodes
        ):
            self.is_finished = True
            self.finish()
        else:
            nodes_to_add.append(self.loop_nodes[-1])
        for node_id in nodes_to_add:
            self.restart(node_id)
        for node_id in nodes_to_add:
            if (
                self.working_graph.in_degree(node_id) == 0
            ):
                next_nodes_from_dependencies.add(node_id)
        return list(next_nodes_from_dependencies)

    def is_loop_node(self, job_id: str) -> bool:
        node = self.original_graph.nodes[job_id]
        return bool(node and node["cmd"] == "LOOP")
    
    def get_job_dependencies_with_label(
        self, job_id: str, original: bool = True
    ) -> list[dict[str, str]]:
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