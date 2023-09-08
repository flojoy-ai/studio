from queue import Queue
import time
from typing import Any, Callable, cast
import uuid
from flojoy import JobService
from flojoy import JobSuccess, JobFailure
from captain.types.worker import JobInfo, PoisonPill
from captain.utils.logger import logger
from captain.utils.status_codes import STATUS_CODES
"""
IMPORTANT NOTE: This class mimics the RQ Worker package. 
"""


class Worker:
    def __init__(
        self,
        task_queue: Queue[Any], # queue for tasks to be processed
        finish_queue: Queue[Any], # queue for finished tasks
        imported_functions: dict[str, Any], # map of job id to corresponding function 
        signal_running_node: Callable, # function for signaling the status of which node is running
        signal_failed_node: Callable, # function for signaling the status of which node has failed        
        signal_node_results: Callable, # function for signaling the status of the results of a node
        node_delay: float = 0,
    ):
        self.task_queue = task_queue
        self.finish_queue = finish_queue
        self.imported_functions = imported_functions
        self.signal_running_node = signal_running_node
        self.signal_failed_node = signal_failed_node
        self.signal_node_results = signal_node_results
        self.job_service = JobService()
        self.uuid = uuid.uuid4()
        self.node_delay = node_delay

    async def run(self):
        logger.debug(f"Worker {self.uuid} has started")
        while True:
            queue_fetch = self.task_queue.get()

            # attempt to get job info, if not then possible poison pill
            try:
                job = cast(JobInfo, queue_fetch)
            except Exception:
                if isinstance(queue_fetch, PoisonPill):
                    logger.debug(f"Worker {self.uuid} got poison pill.")
                    break
                else:
                    logger.error("Error in job: wrong arguments passed. Ignoring...")
                    continue

            func = self.imported_functions.get(job.job_id, None)
            if func is None:
                raise ValueError(
                    f"Function {job.job_id} not found in imported functions"
                )
            
            # signal the running node to the front-end: 
            self.signal_running_node(job.jobset_id, job.job_id, func.__name__)

            kwargs: dict[str, Any] = {
                "ctrls": job.ctrls,
                "previous_jobs": job.previous_jobs,
                "jobset_id": job.jobset_id,
                "node_id": job.job_id,
                "job_id": job.iteration_id,
            }

            logger.debug("=" * 100)
            logger.debug(f"Executing job {job.job_id}, kwargs = {kwargs}")

            response = func(**kwargs)

            match response:
                case JobSuccess():
                    logger.debug(f"Job finished: {job.job_id}, status: ok")

                    # send results to frontend
                    self.signal_node_results(job.jobset_id, job.job_id, func.__name__, response.result)

                case JobFailure():
                    logger.debug(f"Job finished: {job.job_id}, status: failed")

                    #signal to frontend that the node has failed
                    self.signal_failed_node(job.jobset_id, job.job_id, func.__name__)

            # put the job result in the queue for producer to process 
            self.finish_queue.put(response)
            self.task_queue.task_done()

        logger.info(f"Worker {self.uuid} has finished")
