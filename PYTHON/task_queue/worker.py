from multiprocessing import SimpleQueue
import pickle
from typing import Any
from PYTHON.dao.redis_dao import RedisDao
from captain.types.worker import JobInfo
from rq.job import Job


"""
IMPORTANT NOTE: This class mimics the RQ Worker package. 
"""
class Worker:
    def __init__(self, task_queue: SimpleQueue, imported_functions: dict[str, Any]):
        self.task_queue = task_queue
        self.imported_functions = imported_functions
        self.redis_dao = RedisDao()

    def run(self):
        while True:
            print(f"Getting job, is task_queue empty: {self.task_queue.empty()}", flush=True)
            queue_fetch = self.task_queue.get()
            print("Got job", flush=True)
            try: 
                job: JobInfo = queue_fetch
            except:
                print("Error in job: wrong arguments passed. Ignoring...", flush=True)
                continue
            print("Importing function", flush=True)
            func = self.imported_functions.get(job.job_id, None)
            if func is None:
                raise Exception(f"Function {job.job_id} not found in imported functions")
            
            print("Deleting job", flush=True)
            if Job.exists(job.job_id, self.redis_dao.r):
                job_to_delete = Job.fetch(job.job_id, connection=self.redis_dao.r)
                job_to_delete.delete()

            print("Creating fake job", flush=True)
            # create fake job in Redis
            fake_job = Job.create(func=lambda x: None, connection=self.redis_dao.r)
            fake_job.set_id(job.job_id)
            fake_job.save()

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

            # post job result to redis such that it can be fetched by next jobs 
            self.redis_dao.r.hset(f"rq:job:{job.job_id}".encode('utf-8'), "result", pickle.dumps(res))

            
            