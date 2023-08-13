from queue import Queue
import time
from typing import Any, cast
import uuid
from flojoy.job_service import JobService
from captain.types.worker import JobInfo
from captain.utils.logger import logger

"""
IMPORTANT NOTE: This class mimics the RQ Worker package. 
"""


class Worker:
    def __init__(self, task_queue: Queue[Any], imported_functions: dict[str, Any], node_delay: float = 0):
        self.task_queue = task_queue
        self.imported_functions = imported_functions
        self.job_service = JobService()
        self.uuid = uuid.uuid4()
        self.node_delay = node_delay

    def run(self):
        while True:
            queue_fetch = self.task_queue.get()

            try:
                job = cast(JobInfo, queue_fetch)
            except Exception:
                logger.error("Error in job: wrong arguments passed. Ignoring...")
                continue

            # check if got terminate signal
            if job.terminate:
                logger.info(f"Worker {self.uuid} got terminate signal.")
                break

            func = self.imported_functions.get(job.job_id, None)
            if func is None:
                raise ValueError(
                    f"Function {job.job_id} not found in imported functions"
                )

            if self.job_service.job_exists(job.job_id):
                self.job_service.delete_job(job.job_id)

            kwargs: dict[str, Any] = {
                "ctrls": job.ctrls,
                "previous_jobs": job.previous_jobs,
                "jobset_id": job.jobset_id,
                "node_id": job.job_id,
                "job_id": job.iteration_id,
            }

            logger.debug("=" * 100)
            logger.debug(f"Executing job {job.job_id}, kwargs = {kwargs}")

            func(**kwargs)
            logger.debug(f"Job finished: {job.job_id}, status: ok")

            # For now, job result is posted inside the flojoy wrapper function
            self.task_queue.task_done()

        logger.info(f"Worker {self.uuid} has finished")
