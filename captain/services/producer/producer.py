from queue import Queue
from typing import Any
import uuid

from captain.types.worker import (
    PoisonPill,
    ProcessTaskType,
    QueueTaskType,
    InitFuncType,
)

from captain.utils.logger import logger


class Producer:
    def __init__(
        self,
        task_queue: Queue[Any],
        finish_queue: Queue[Any],
        process_task: ProcessTaskType,
        queue_task: QueueTaskType,
        init_func: InitFuncType,
    ) -> None:
        self.task_queue = task_queue
        self.finish_queue = finish_queue
        self.process_task = process_task  # process a task and get potential new tasks
        self.queue_task = queue_task  # function to queue the new tasks
        self.init_func = init_func  # function to run before starting the producer
        self.uuid = uuid.uuid4()

    async def run(self):
        logger.debug(f"Producer {self.uuid} has started")
        # first, run init func
        self.init_func(self.task_queue)
        while True:
            finished_job_fetch = self.finish_queue.get()
            logger.debug(f"Received finished job: {finished_job_fetch}")

            # verify if poison pill
            if isinstance(finished_job_fetch, PoisonPill):
                logger.debug(f"Producer {self.uuid} got poison pill.")
                break

            # process job info
            new_tasks = self.process_task(finished_job_fetch)
            
            # if no new tasks, then continue
            if new_tasks is None:
                logger.debug(f"Producer {self.uuid} got no new tasks")
                continue
            
            logger.debug(f"Producer {self.uuid} got new tasks: {new_tasks}")

            # queue new tasks
            for new_task in new_tasks:
                logger.debug(f"Producer {self.uuid} is queuing new task: {new_task}")
                self.queue_task(new_task, self.task_queue)

            self.finish_queue.task_done()

        logger.debug(f"Producer {self.uuid} has finished")
