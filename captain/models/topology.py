from copy import deepcopy
import os
import time

from PYTHON.utils.dynamic_module_import import get_module_func


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
 

    # initial logic of topology
    def run(self):
        next_jobs = self.collect_ready_jobs() #get nodes with in-degree 0
        for job_id in next_jobs:
            self.run_job(job_id)
            time.sleep(self.node_delay)

    def collect_ready_jobs(self):
        next_jobs = []
        for job_id in self.working_graph.nodes:
            if job_id not in self.finished_jobs and self.working_graph.in_degree(job_id) == 0:
                next_jobs.append(job_id) 
        return next_jobs
    
    def run_job(self, job_id):
        raise NotImplementedError("Function not implemented.")

    def get_job_dependencies(self, job_id):
        try:
            return list(self.original_graph.predecessors(job_id))
        except Exception:
            return []


