from queue import Queue
import sys
from typing import Any
import uuid
from flojoy.job_service import JobService
from captain.types.worker import JobInfo


"""
Wraps the stdout to include the UUID of the worker process
"""
class CustomPrint:
    def __init__(self, id, stdout):
        self.id = id
        self.stdout = stdout

    def write(self, text):
        text = text.strip()
        if text: # ignore empty lines
            self.stdout.write(f'{self.id} {text}\n')

    def flush(self):
        self.stdout.flush()

"""
IMPORTANT NOTE: This class mimics the RQ Worker package. 
"""
class Worker:
    def __init__(self, task_queue: Queue, imported_functions: dict[str, Any]):
        self.task_queue = task_queue
        self.imported_functions = imported_functions
        self.job_service = JobService()
        self.uuid = uuid.uuid4()
    
    def run(self):
        sys.stdout = CustomPrint(self.uuid, sys.stdout)
        while True:
            queue_fetch = self.task_queue.get()
            
            try: 
                job: JobInfo = queue_fetch
            except:
                print("Error in job: wrong arguments passed. Ignoring...")
                continue

            # check if got terminate signal
            if job.terminate:
                print(f"Worker {self.uuid} got terminate signal. Exiting...")
                break

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

            func(**kwargs)
            # For now, job result is posted inside the flojoy wrapper function
        print("exiting...")

            
            