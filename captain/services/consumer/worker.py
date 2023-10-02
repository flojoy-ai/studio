import uuid
from queue import Queue
from typing import Any, cast

from flojoy import JobFailure, JobService, JobSuccess
from flojoy.flojoy_node_venv import PipInstallThread

from captain.types.worker import JobInfo, PoisonPill
from captain.utils.broadcast import Signaler
from captain.utils.logger import logger

"""
IMPORTANT NOTE: This class mimics the RQ Worker package. 
"""


class Worker:
    def __init__(
        self,
        task_queue: Queue[Any],  # queue for tasks to be processed
        finish_queue: Queue[Any],  # queue for finished tasks
        imported_functions: dict[str, Any],  # map of job id to corresponding function
        signaler: Signaler | None = None,  # signaler object to signal to the front-end
        node_delay: float = 0,
    ):
        self.task_queue = task_queue
        self.finish_queue = finish_queue
        self.imported_functions = imported_functions
        self.signaler = signaler
        self.job_service = JobService()
        self.uuid = uuid.uuid4()
        self.node_delay = node_delay

    async def run(self):
        logger.debug(f"Worker {self.uuid} has started")
        while True:
            queue_fetch = self.task_queue.get()

            if isinstance(queue_fetch, PoisonPill):
                logger.debug(f"Worker {self.uuid} got poison pill.")
                break

            # cast for type purposes
            try:
                job = cast(JobInfo, queue_fetch)
            except Exception:
                logger.error("Error in job: wrong arguments passed. Ignoring...")
                continue

            func = self.imported_functions.get(job.job_id, None)
            if func is None:
                raise ValueError(
                    f"Function {job.job_id} not found in imported functions"
                )
            if self.signaler:
                # signal the running node to the front-end:
                await self.signaler.signal_current_running_node(
                    job.jobset_id, job.job_id, func.__name__
                )

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
                    if self.signaler:
                        # send results to frontend
                        await self.signaler.signal_node_results(
                            job.jobset_id, job.job_id, func.__name__, response.result
                        )

                case JobFailure():
                    logger.debug(f"Job finished: {job.job_id}, status: failed")
                    if self.signaler:
                        # signal to frontend that the node has failed
                        await self.signaler.signal_failed_nodes(
                            job.jobset_id, job.job_id, func.__name__, response.error
                        )
                    PipInstallThread.terminate_all()
                    raise Exception(response.error)

            # put the job result in the queue for producer to process
            self.finish_queue.put(response)
            self.task_queue.task_done()

        logger.info(f"Worker {self.uuid} has finished")
