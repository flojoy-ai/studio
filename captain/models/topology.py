from copy import deepcopy
import logging
import os
from queue import Queue
import time
from collections import deque
from flojoy import (
    JobFailure,
    JobSuccess,
    get_next_directions
)
from flojoy.utils import clear_flojoy_memory  # for some reason, cant import from
from captain.types.worker import JobInfo
from captain.utils.logger import logger
import networkx as nx
from typing import Any, cast


class Topology:
    """
    Holds information of the flowchart and the state of the topology.
    Used for running the flowchart and handles the logic.
    """

    # TODO: Properly type all the variables and maybe get rid of deepcopy?
    # TODO: Remove unnecessary logger.debug statements
    def __init__(
        self,
        graph: nx.MultiDiGraph,
        jobset_id: str,
        node_delay: float = 0,
    ):
        self.working_graph: nx.MultiDiGraph = deepcopy(graph)
        self.original_graph: nx.MultiDiGraph = deepcopy(graph)
        self.jobset_id = jobset_id
        self.node_delay = node_delay
        self.finished_jobs: set[str] = set()
        self.queued_jobs: set[str] = set()
        self.is_ci = os.getenv(key="CI", default=False)
        self.cancelled = False
        self.time_start = 0
        self.is_finished = False
        self.loop_nodes = (
            list()
        )  # using list instead of set as we need to maintain order

    def process_worker_response(
        self, finished_job_fetch: JobSuccess | JobFailure
    ) -> list[str] | None:
        """
        Handle when producer receives the consumer's response (worker response).
        Returns potential new tasks (jobs) to be run.
        """
        if self.is_cancelled():
            logger.debug("Flowchart is cancelled, ignoring worker response")
            return

        # handle failed job
        if isinstance(finished_job_fetch, JobFailure):
            self.process_job_result(
                job_id=finished_job_fetch.node_id, job_result=None, success=False
            )

        # handle successful job
        elif isinstance(finished_job_fetch, JobSuccess):
            logger.debug(f"{finished_job_fetch.node_id} finished at {time.time()}")
            return self.handle_finished_job(
                finished_job_fetch, return_new_jobs=True
            )  # return new jobs

    def run(self, task_queue: Queue[Any]):
        """
        Topology entry point function for producer
        """
        self.time_start = time.time()
        next_jobs: list[str] = self.collect_ready_jobs()  # get nodes with in-degree 0
        self.run_jobs(next_jobs, task_queue)

    def collect_ready_jobs(self):
        next_jobs: list[str] = []
        for job_id in cast(list[str], self.working_graph.nodes):
            if (
                job_id not in self.finished_jobs
                and self.original_graph.in_degree(job_id) == 0
            ):
                next_jobs.append(job_id)
        return next_jobs

    def run_jobs(self, jobs: list[str], task_queue: Queue[Any]):
        for job_id in jobs:
            self.run_job(job_id, task_queue)

    def run_job(self, job_id: str, task_queue: Queue[Any]):
        node = cast(dict[str, Any], self.working_graph.nodes[job_id])

        previous_jobs = self.get_job_dependencies_with_label(job_id, original=True)

        logger.debug(
            f" enqueue job: {self.get_label(job_id)}, dependencies: {[self.get_label(dep_id.get('job_id', ''), original=True) for dep_id in previous_jobs]}"
        )

        logger.debug(f"{job_id} queued at {time.time()}")

        # -- queue the job --
        task_queue.put(
            JobInfo(
                job_id=job_id,
                jobset_id=self.jobset_id,
                iteration_id=job_id,
                ctrls=node["ctrls"],
                previous_jobs=previous_jobs,
            )
        )
        self.queued_jobs.add(job_id)
        # -------------------

        if self.is_loop_node(job_id):
            self.loop_nodes.append(job_id)

    # also used for when the topology finishes
    def cancel(self):
        logger.debug("Topology cancelled")
        self.cancelled = True
        self.queued_jobs.clear()
        self.cleanup()
        self.finalizer()

    def is_cancelled(self):
        return self.cancelled

    def handle_finished_job(self, job: JobSuccess, return_new_jobs: bool = False):
        """
        get the data from the worker response
        (flojoy package is responsible for sending to /worker_response endpoint)
        """
        if self.cancelled:
            logger.debug("Received job, but skipping since topology is cancelled")
            return

        time.sleep(self.node_delay)

        job_id: str = job.node_id
        job_result = job.result

        logger.debug(f"job {self.get_label(job_id)} is done and has been received.")
        if job_id in self.queued_jobs:
            self.queued_jobs.remove(job_id)
        if job_id in self.finished_jobs:
            logging.warning(
                f"{job_id} HAS ALREADY BEEN PROCESSED, NOT SUPPOSED TO HAPPEN"
            )
            return
        self.finished_jobs.add(job_id)

        if job_id is None:
            raise ValueError("job_id is not supposed to be None")

        next_jobs = self.process_job_result(job_id, job_result, success=True)

        if return_new_jobs:
            return next_jobs

    def process_job_result(
        self, job_id: str, job_result: dict[str, Any] | None, success: bool
    ):
        """
        process special instructions to scheduler
        """

        logger.debug(f"processing job result for: {self.get_label(job_id)}")

        if not success:
            logger.debug(f"{job_id} job failed")
            self.mark_job_failure(job_id)
            self.cancel()
            return None

        # process instruction to flow through specified directions
        next_nodes_from_dependencies: set[str] = set()

        next_directions: list[str] | None = get_next_directions(job_result)
        # In this case, the node did not explicitly supply what
        # its output directions should be
        # ex: Conditionals and Loops only want to continue in one direction out of the two
        # If the node doesn't explicitly specify this then we just continue in all directions
        if not next_directions:
            next_directions = self.get_outputs(job_id)

        logger.debug(f"out_edges to follow: {next_directions}")

        for direction_ in next_directions:
            direction = direction_.lower()
            if direction == "end" and self.loop_nodes:
                self.loop_nodes.pop()
            next_nodes = self.remove_edges_and_get_next(job_id, direction)
            next_nodes_from_dependencies = next_nodes_from_dependencies.union(
                next_nodes
            )

        logger.debug(
            "After removing edges of node, next nodes are: "
            + str(next_nodes_from_dependencies)
        )

        nodes_to_add: list[str] = []

        # -- verify if the flowchart is done running --
        if (
            self.queued_jobs.__len__() == 0
            and next_nodes_from_dependencies.__len__() == 0
        ):
            if not self.loop_nodes:
                self.is_finished = True
                logger.debug(
                    f"FLOWCHART TOOK {time.time() - self.time_start} SECONDS TO COMPLETE"
                )
                self.cancel()
                return
            else:
                nodes_to_add.append(self.loop_nodes[-1])
        # ---------------------------------------------

        if nodes_to_add:
            logger.debug(
                f"Restarting the following nodes: {[self.get_label(n_id, original=True) for n_id in nodes_to_add]}",
            )
        for node_id in nodes_to_add:
            self.restart(node_id)

        for node_id in nodes_to_add:
            if (
                self.working_graph.in_degree(node_id) == 0
            ):  # check if no dependencies left for node
                next_nodes_from_dependencies.add(node_id)

        return list(next_nodes_from_dependencies)

    def remove_edges_and_get_next(self, job_id: str, label_direction: str = "default"):
        """
        this function removes the node edges and checks its successors
        for new jobs. A new job is ready when a sucessor has no dependencies.
        """
        self.finished_jobs.add(job_id)
        successors: list[str] = list(self.working_graph.successors(job_id))
        self.remove_dependencies(job_id, label_direction)
        next_nodes = set()
        for d_id in successors:
            if d_id in self.finished_jobs:
                continue
            if self.working_graph.in_degree(d_id) == 0:
                next_nodes.add(d_id)
        logger.debug("next nodes: " + str(next_nodes))
        return next_nodes

    def restart(self, job_id: str):
        logger.debug(f" *** restarting job: {self.get_label(job_id, original=True)}")
        if self.loop_nodes:
            self.loop_nodes.pop()
        graph = self.original_graph
        sub_graph: nx.MultiDiGraph = graph.subgraph(
            [job_id] + list(nx.descendants(graph, job_id))
        )
        original_edges = sub_graph.edges(data=True)
        self.working_graph.add_edges_from(original_edges)
        self.finished_jobs.remove(job_id)

        for d_id in nx.descendants(self.working_graph, job_id):
            if d_id in self.finished_jobs:
                self.finished_jobs.remove(d_id)

    def finalizer(self):
        if self.is_finished:
            pass  # add things here in the future

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
        edges = self.working_graph.edges(job_id, data=True)
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
            for prev_job_id, _, data in list(graph.in_edges(job_id, data=True)):
                input_name = data.get("target_label", "")
                multiple = data.get("multiple", False)
                edge_label = data.get("label", "")
                deps.append(
                    {
                        "job_id": prev_job_id,
                        "input_name": input_name,
                        "multiple": multiple,
                        "edge": edge_label,
                    }
                )
            logger.debug(f"deps: {deps}")
            return deps
        except Exception:
            return []

    def get_input_info(
        self, source_job_id: str, target_job_id: str, original: bool = False
    ) -> list[tuple[str, bool]]:
        graph = self.get_graph(original)
        edge_data = graph.get_edge_data(source_job_id, target_job_id)
        target_label = ""
        multiple = False
        dependencies = []
        if edge_data:
            for edge in edge_data.values():
                target_label = edge.get("target_label", "")
                multiple = edge.get("multiple", False)
                dependencies.append((target_label, multiple))
        return dependencies

    def remove_dependency(self, job_id: str, succ_id: str):
        if self.working_graph.has_edge(job_id, succ_id):
            logger.debug(
                f"  - remove dependency: {self.get_edge_label_string(job_id, succ_id)}"
            )
            while self.working_graph.has_edge(job_id, succ_id):
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
            return list(self.working_graph.predecessors(job_id))
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
    def get_maximum_workers(self, maximum_capacity: int = 1):
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
        out = self.working_graph.out_edges(job_id)
        return list(
            set(
                edge["label"]
                for (u, v) in out
                for edge in self.working_graph.get_edge_data(u, v).values()
            )
        )

    def is_loop_node(self, job_id: str):
        node = cast(
            dict[str, Any], self.original_graph.nodes[job_id]
        )  # working graph is modified after each node run so it's safe to use original graph to retrieve the node
        return bool(node and node["cmd"] == "LOOP")

    def cleanup(self):
        clear_flojoy_memory()
