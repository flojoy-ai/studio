import asyncio
from copy import deepcopy
import logging
import os
from queue import Queue
import time
from collections import deque
from flojoy import get_next_directions, get_next_nodes
from PYTHON.utils.dynamic_module_import import get_module_func
from flojoy.job_service import JobService
from flojoy.node_init import node_init
from captain.types.worker import JobInfo
from captain.utils.logger import logger
import networkx as nx
from importlib import import_module
from typing import Any, Tuple, cast, Callable

lock = asyncio.Lock()


class Topology:
    # TODO: Properly type all the variables and maybe get rid of deepcopy?
    # TODO: Remove unnecessary logger.debug statements
    def __init__(
        self,
        graph: nx.DiGraph,
        jobset_id: str,
        task_queue: Queue,
        cleanup_func: Callable,
        node_delay: float = 0,
        max_runtime: float = 3000,
    ):
        self.working_graph = deepcopy(graph)
        self.original_graph = deepcopy(graph)
        self.jobset_id = jobset_id
        self.node_delay = node_delay
        self.max_runtime = max_runtime
        self.finished_jobs: set[str] = set()
        self.is_ci = os.getenv(key="CI", default=False)
        self.job_service = JobService(self.max_runtime)
        self.cancelled = False
        self.time_start = 0
        self.task_queue = task_queue
        self.cleanup_func = cleanup_func

    # initial and main logic of topology
    async def run(self):
        self.time_start = time.time()
        async with lock:
            next_jobs: list[
                str
            ] = self.collect_ready_jobs()  # get nodes with in-degree 0
        self.run_jobs(next_jobs)

    def run_jobs(self, jobs: list[str]):
        for job_id in jobs:
            asyncio.create_task(self.run_job(job_id))
            time.sleep(self.node_delay)

    def collect_ready_jobs(self):
        next_jobs: list[str] = []
        for job_id in cast(list[str], self.original_graph.nodes):
            if (
                job_id not in self.finished_jobs
                and self.original_graph.in_degree(job_id) == 0
            ):
                next_jobs.append(job_id)
        return next_jobs

    # TODO move this to utils, makes more sense there
    def pre_import_functions(self):
        functions = {}
        for node_id in cast(list[str], self.original_graph.nodes):
            node = cast(dict[str, Any], self.original_graph.nodes[node_id]) 
            cmd: str = node["cmd"]
            cmd_mock: str = node["cmd"] + "_MOCK"
            node_path: str = node.get("node_path", "")
            node_path = node_path.replace("\\", "/").replace("/", ".").replace(".py", "")
            if node_path != "":
                module = import_module(node_path)
            else:
                module = get_module_func(cmd)
            func_name = cmd_mock if self.is_ci else cmd
            try:
                func = getattr(module, func_name)
            except AttributeError:
                func = getattr(module, cmd)
            
            # check if the module has an init function, and initialize it if it does
            try: 
                init_func = getattr(module, "flojoy_node_init")
                node_init(init_func, node_id) # type: ignore
            except AttributeError:
                pass

            functions[node_id] = func
        return functions


    async def run_job(self, job_id: str):
        async with lock:
            node = cast(dict[str, Any], self.original_graph.nodes[job_id])
        cmd: str = node["cmd"]
        cmd_mock: str = node["cmd"] + "_MOCK"
        node_path: str = node.get("node_path", "")
        node_path = node_path.replace("\\", "/").replace("/", ".").replace(".py", "")
        if node_path != "":
            module = import_module(node_path)
        else:
            module = get_module_func(cmd)
        func_name = cmd_mock if self.is_ci else cmd
        try:
            func = getattr(module, func_name)
        except AttributeError:
            func = getattr(module, cmd)

        previous_jobs = self.get_job_dependencies_with_label(job_id, original=True)

        logger.debug(
            f" enqueue job: {self.get_label(job_id)}, dependencies: {[self.get_label(dep_id.get('job_id', ''), original=True) for dep_id in previous_jobs]}"
        )

        logger.debug(f"{job_id} queued at {time.time()}")

        # enqueue job to worker and get the AsyncResult
        # self.job_service.enqueue_job(
        #     func=func,
        #     jobset_id=self.jobset_id,
        #     job_id=job_id,
        #     iteration_id=job_id,
        #     ctrls=node["ctrls"],
        #     previous_jobs=previous_jobs,
        # )
        self.task_queue.put(JobInfo(
            job_id=job_id,
            jobset_id=self.jobset_id,
            iteration_id=job_id,
            ctrls=node["ctrls"],
            previous_jobs=previous_jobs,
        ))

    # also used for when the topology finishes
    def cancel(self):
        logger.debug("Topology cancelled")
        self.cancelled = True
        self.finalizer()

    async def handle_finished_job(self, result: dict[str, Any]):
        #
        # get the data from the worker response
        # (@flojoy wrapper is responsible for sending to this route in func)

        if self.cancelled:
            logger.debug("Received job, but skipping since cancelled")
            return

        job_id: str = result.get("NODE_RESULTS", {}).get("id", None)
        job_result = result.get("NODE_RESULTS", {}).get("result", None)

        logger.debug(f"job {self.get_label(job_id)} is done and has been received.")
        async with lock:
            if job_id in self.finished_jobs:
                logging.warning(
                    f"{job_id} HAS ALREADY BEEN PROCESSED, NOT SUPPOSED TO HAPPEN"
                )
                return
            self.finished_jobs.add(job_id)

        if job_id is None or job_result is None:
            raise ValueError("job_id is not supposed to be None")

        async with lock:
            next_jobs = self.process_job_result(
                job_id, job_result, success=True
            )  # TODO: handle in case of failure

        if next_jobs:
            logger.debug(f"Starting next jobs: {next_jobs}")
            self.run_jobs(next_jobs)

    def process_job_result(
        self, job_id: str, job_result: dict[str, Any], success: bool
    ):
        """
        process special instructions to scheduler
        """

        logger.debug(f"processing job result for: {self.get_label(job_id)}")
        if not success:
            logger.debug(f"{job_id} job failed")
            self.mark_job_failure(job_id)
            return []

        logger.debug(f"job id: {job_id}")

        # if the job is an end node, then we are done
        if self.get_cmd(job_id) == "END":
            self.is_finished = True
            logger.debug(
                f"FLOWCHART TOOK {time.time() - self.time_start} SECONDS TO COMPLETE"
            )
            self.cancel()
            return

        # process instruction to flow through specified directions
        next_nodes_from_dependencies: set[str] = set()

        next_directions: list[str] | None = get_next_directions(job_result)
        # In this case, the node did not explicitly supply what
        # its output directions should be
        # ex: Conditionals and Loops only want to continue in one direction out of the two
        # If the node doesn't explicitly specify this then we just continue in all directions
        if not next_directions:
            next_directions = self.get_outputs(job_id)

        logger.debug(f"out_edges: {self.get_outputs(job_id)}")

        for direction_ in next_directions:
            direction = direction_.lower()
            self.mark_job_success(job_id, next_nodes_from_dependencies, direction)

        # process instruction to flow to specified nodes
        nodes_to_add: list[str] = []
        next_nodes = get_next_nodes(job_result)

        if next_nodes:
            nodes_to_add += [node_id for node_id in next_nodes]

        if len(nodes_to_add) > 0:
            logger.debug(
                f"Adding nodes to graph: {[self.get_label(n_id, original=True) for n_id in nodes_to_add]}",
            )

        for node_id in nodes_to_add:
            self.restart(node_id)

        for node_id in nodes_to_add:
            if (
                self.working_graph.in_degree(node_id) == 0
            ):  # check if no dependencies left for node
                next_nodes_from_dependencies.add(node_id)

        return list(next_nodes_from_dependencies)

    # this function removes the node and checks its successors
    # for new jobs. A new job is ready when a sucessor has no dependencies.
    # NOTE doesn't actually remove the node, just its edges/dependencies corresponding to the label/direction
    def remove_edges_and_get_next(
        self, job_id: str, label_direction: str, next_nodes: set[str]
    ):
        successors: list[str] = list(self.working_graph.successors(job_id))
        self.remove_dependencies(job_id, label_direction)
        for d_id in successors:
            if d_id in self.finished_jobs:
                continue
            if self.working_graph.in_degree(d_id) == 0:
                next_nodes.add(d_id)

    def restart(self, job_id: str):
        logger.debug(f" *** restarting job: {self.get_label(job_id, original=True)}")

        graph = self.original_graph
        sub_graph = graph.subgraph([job_id] + list(nx.descendants(graph, job_id)))
        original_edges = sub_graph.edges
        original_edges = [
            (s, t, self.original_graph.get_edge_data(s, t)) for (s, t) in original_edges
        ]

        self.working_graph.add_edges_from(original_edges)

        self.finished_jobs.remove(job_id)

        for d_id in nx.descendants(self.working_graph, job_id):
            try:
                self.finished_jobs.remove(d_id)
            except Exception:
                pass

    def finalizer(self):
        # run provided clean up function
        self.cleanup_func()

    # also used for when the topology is finished
    def is_cancelled(self):
        return self.cancelled

    def mark_job_success(
        self, job_id: str, next_nodes: set[str], label: str = "default"
    ):
        logger.debug(f"  job finished: {self.get_label(job_id)}, label: {label}")
        self.finished_jobs.add(job_id)    
        self.remove_edges_and_get_next(job_id, label, next_nodes)

    def mark_job_failure(self, job_id: str):
        self.finished_jobs.add(job_id)
        logger.debug(f"job {self.get_label(job_id)} failed")

    def get_cmd(self, job_id: str, original: bool = False) -> str:
        graph = self.get_graph(original)
        if graph.has_node(job_id):
            return graph.nodes[job_id].get("cmd", job_id)
        else:
            logger.debug(
                f"get_label: job_id {job_id} not found in original: {original}"
            )
        return job_id

    def remove_dependencies(self, job_id: str, label: str = "default"):
        edges = self.get_edges_by_label(job_id, label)
        for edge in edges:
            self.remove_dependency(edge[0], edge[1])

    def get_edges_by_label(self, job_id: str, label: str) -> list[tuple[str, Any, Any]]:
        edges = self.working_graph.edges(job_id)
        edges = [(s, t, self.working_graph.get_edge_data(s, t)) for (s, t) in edges]
        edges = [
            (s, t, data) for (s, t, data) in edges if data.get("label", "") == label
        ]
        return edges

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
            logger.debug(f"deps: {deps}")
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

    def remove_dependency(self, job_id: str, succ_id: str):
        if self.working_graph.has_edge(job_id, succ_id):
            logger.debug(
                f"  - remove dependency: {self.get_edge_label_string(job_id, succ_id)}"
            )
            self.working_graph.remove_edge(job_id, succ_id)

    def get_edge_label_string(
        self,
        source_job_id: str,
        target_job_id: str,
        label: str | None = None,
        original: bool = False,
    ):
        graph = self.get_graph(original)
        if label is None:
            edge_data = graph.get_edge_data(source_job_id, target_job_id)

            label = "" if edge_data is None else edge_data.get("label", "")
        s = self.get_label(source_job_id, original=original)
        t = self.get_label(target_job_id, original=original)
        return f"{s} -- {label} --> {t}"

    def get_job_dependencies(self, job_id: str) -> list[str]:
        try:
            return list(self.original_graph.predecessors(job_id))
        except Exception:
            return []

    def get_label(self, job_id: str, original: bool = False) -> str:
        graph = self.get_graph(original)
        if graph.has_node(job_id):
            return graph.nodes[job_id].get("label", job_id)
        else:
            logger.debug(
                f"get_label: job_id {job_id} not found in original: {original}"
            )
        return job_id

    def get_graph(self, original: bool):
        return self.original_graph if original else self.working_graph

    # this function will get the maximum amount of independant nodes during the topological sort of the graph.
    # Will be used to determine how many workers to spawn
    # TODO (priority very low): delete edges based on their label: currenly, we are deleting all edges regardless of their labels.
    # So for example :
    # Suppose we have a graph with 3 nodes: LOOP, node1, node2 and end,
    # assuming LOOP is the only dependency of all the nodes,
    # and the LOOP node has 2 sucessors from "body" (node1, node2) and 1 from "end" (end),
    # we will spawn 3 workers instead of the logical amount which is 2.
    def get_maximum_workers(self, maximum_capacity: int = 4):
        max_independant = 0
        temp_graph = deepcopy(self.original_graph)
        queue = deque()
        for job_id in self.collect_ready_jobs():
            queue.append(job_id)

        while len(queue) > 0:
            n = len(queue)
            max_independant = max(n, max_independant)
            if max_independant >= maximum_capacity:
                return maximum_capacity
            for _ in range(n):
                job_id = queue.popleft()
                successors = temp_graph.successors(job_id)
                temp_graph.remove_node(job_id)
                for neighbour in successors:
                    if temp_graph.in_degree(neighbour) == 0:
                        queue.append(neighbour)

        return max_independant

    def get_outputs(self, job_id: str):
        out = self.original_graph.out_edges(job_id)
        return list(
            set(self.working_graph.get_edge_data(u, v)["label"] for (u, v) in out)
        )

    def cleanup(self):
        self.job_service.reset()
