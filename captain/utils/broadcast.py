from typing import Any
from captain.internal.manager import ConnectionManager
from captain.utils.status_codes import STATUS_CODES
from captain.types.worker import WorkerJobResponse
from captain.utils.logger import logger


class Signaler:
    """
    Class used to signal the status of the topology to the front-end client
    """

    def __init__(self, ws: ConnectionManager):
        self.ws = ws

    async def signal_node_results(
        self, jobset_id: str, node_id: str, func_name: str, result: dict[str, Any]
    ):
        msg = WorkerJobResponse(
            jobset_id=jobset_id,
            result=result,
            cmd=func_name,
            node_id=node_id,
        )
        await self.ws.broadcast(msg)

    async def signal_current_running_node(
        self, jobset_id: str, node_id: str, func_name: str
    ):
        msg = WorkerJobResponse(
            jobset_id=jobset_id,
            sys_status=STATUS_CODES["RUNNING_PYTHON_JOB"] + func_name,
            running_node=node_id,
        )
        await self.ws.broadcast(msg)

    async def signal_failed_nodes(self, jobset_id: str, node_id: str, func_name: str):
        msg = WorkerJobResponse(
            jobset_id=jobset_id,
            sys_status=STATUS_CODES["FAILED_NODE"] + func_name,
            failed_nodes={node_id: "FAILED"},
        )
        await self.ws.broadcast(msg)

    async def signal_prejob_op(self, jobset_id: str):
        msg = WorkerJobResponse(
            jobset_id=jobset_id, sys_status=STATUS_CODES["RUN_PRE_JOB_OP"]
        )
        await self.ws.broadcast(msg)

    async def signal_standby(self, jobset_id: str):
        msg = WorkerJobResponse(
            jobset_id=jobset_id,
            sys_status=STATUS_CODES["STANDBY"],
            failed_nodes=[],
            running_node="",
        )
        await self.ws.broadcast(msg)

    async def signal_max_runtime_exceeded(self, jobset_id: str):
        msg = WorkerJobResponse(
            jobset_id=jobset_id,
            sys_status=STATUS_CODES["MAXIMUM_RUNTIME_EXCEEDED"],
            failed_nodes=[],
            running_node="",
        )
        await self.ws.broadcast(msg)
