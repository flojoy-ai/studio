import asyncio, os, sys

sys.path.append(os.path.abspath(os.getcwd()))
sys.path.append(os.path.join(os.getcwd(), "PYTHON"))
from fastapi import APIRouter, Request, Response
from captain.types.flowchart import (
    PostCancelFC,
    PostWFC,
)
from captain.utils.broadcast import (
    signal_standby,
)
from captain.utils.flowchart_utils import prepare_jobs_and_run_fc
from captain.utils.config import manager
from captain.utils.logger import logger

router = APIRouter(tags=["flowchart"])

# TODO do we want to convert field names from camelCase to snake_case?

@router.post("/cancel_fc", summary="cancel flowchart")
async def cancel_fc(req: PostCancelFC):
    logger.info("Cancelling flowchart...")
    if manager.running_topology is not None:
        manager.running_topology.cancel()
    if req.jobsetId is None:
        logger.debug("No jobsetId provided, skipping signal_standby")
        return
    asyncio.create_task(signal_standby(manager.ws, req.jobsetId))


@router.post("/wfc", summary="write and run flowchart")
async def write_and_run_flowchart(request: PostWFC):
    # create message for front-end to indicate we are running pre-job operations
    await prepare_jobs_and_run_fc(request=request, manager=manager)

