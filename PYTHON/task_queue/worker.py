from multiprocessing import SimpleQueue
import pickle
from typing import Any
from flojoy.job_service import JobService
from captain.types.worker import JobInfo


"""
IMPORTANT NOTE: This class mimics the RQ Worker package. 
"""
class Worker:
    def __init__(self, task_queue: SimpleQueue, imported_functions: dict[str, Any]):
        self.task_queue = task_queue
        self.imported_functions = imported_functions
        self.job_service = JobService()
    def run(self):
        while True:
            queue_fetch = self.task_queue.get()
            try: 
                job: JobInfo = queue_fetch
            except:
                print("Error in job: wrong arguments passed. Ignoring...", flush=True)
                continue
            func = self.imported_functions.get(job.job_id, None)
            if func is None:
                raise Exception(f"Function {job.job_id} not found in imported functions")
            
            if self.job_service.job_exists(job.job_id):
                self.job_service.delete_job(job.job_id)

            kwargs={
                "ctrls": job.ctrls,
                "previous_jobs": job.previous_jobs,
                "jobset_id": job.jobset_id,
                "node_id": job.job_id,
                "job_id": job.iteration_id,
            }

            print("Running job", flush=True)    
            res = func(**kwargs)
            print("Job finished", flush=True)

            # post job result to dao such that it can be fetched by next jobs 
            self.job_service.post_job_result(job.job_id, res)

            
            