import asyncio
from copy import deepcopy
from captain.celery.tasks import run_job_on_worker
import os
import time

from PYTHON.utils.dynamic_module_import import get_module_func

lock = asyncio.Lock()

class Topology:
    # TODO: Properly type all the variables and maybe get rid of deepcopy?
    def __init__(
        self, graph, redis_client, jobset_id, node_delay: int = 0, max_runtime: int = 0
    ):
        self.working_graph = deepcopy(graph)
        self.original_graph = deepcopy(graph)
        self.redis_client = redis_client
        self.jobset_id = jobset_id
        self.node_delay = node_delay
        self.max_runtime = max_runtime
        self.finished_jobs = set()
        self.is_ci = os.getenv(key="CI", default=False)

    # initial and main logic of topology
    async def run(self):
        next_jobs = self.collect_ready_jobs()  # get nodes with in-degree 0
        for job_id in next_jobs:
            asyncio.create_task(self.run_job(job_id))
            time.sleep(self.node_delay)

    def collect_ready_jobs(self):
        next_jobs = []
        for job_id in self.working_graph.nodes:
            if (
                job_id not in self.finished_jobs
                and self.working_graph.in_degree(job_id) == 0
            ):
                next_jobs.append(job_id)
        return next_jobs

    async def run_job(self, job_id):
        node = self.original_graph.nodes[job_id]
        cmd = node["cmd"]
        cmd_mock = node["cmd"] + "_MOCK"
        func = get_module_func(cmd, cmd)
        if self.is_ci:
            try:
                func = get_module_func(cmd, cmd_mock)
            except Exception:
                pass

        dependencies = self.get_job_dependencies(job_id)

        print(
            " enqueue job:",
            self.get_label(job_id),
            "dependencies:",
            [self.get_label(dep_id, original=True) for dep_id in dependencies],
        )

        # enqueue job to worker and get the AsyncResult
        async_result = run_job_on_worker.delay(
            func=func,
            jobset_id=self.jobset_id,
            job_id=job_id,
            iteration_id=job_id,
            ctrls=node["ctrls"],
            previous_job_ids=[],
            input_job_ids=dependencies,
        ) 

        # wait for the job to finish
        result = async_result.get(timeout=self.max_runtime)

    def get_job_dependencies(self, job_id):
        try:
            return list(self.original_graph.predecessors(job_id))
        except Exception:
            return []

    def get_label(self, job_id, original=False):
        graph = self.get_graph(original)
        if graph.has_node(job_id):
            return graph.nodes[job_id].get("label", job_id)
        else:
            print("get_label: job_id", job_id, "not found in original:", original)
        return job_id
    
    def get_graph(self, original):
        return self.original_graph if original else self.working_graph

