import os, sys

sys.path.append(os.path.abspath(os.getcwd()))
sys.path.append(os.path.join(os.getcwd(), "PYTHON"))
from captain.utils.broadcast import Signaler
import asyncio
from fastapi import APIRouter
from captain.types.flowchart import (
    PostCancelFC,
    PostWFC,
)
from captain.utils.flowchart_utils import prepare_jobs_and_run_fc
from captain.utils.config import manager
from captain.utils.logger import logger
from precompilation import precompile

router = APIRouter(tags=["flowchart"])

# TODO do we want to convert field names from camelCase to snake_case?


@router.post("/cancel_fc", summary="cancel flowchart")
async def cancel_fc(req: PostCancelFC):

    logger.debug("Received cancel_fc request")

    if req.jobsetId is None:
            logger.debug("No jobsetId provided, skipping signal_standby")
            return
    
    if not req.precompile:    
        logger.info("Cancelling flowchart...")
        if manager.running_topology is not None:
            manager.running_topology.cancel()
        
        asyncio.create_task(Signaler(manager.ws).signal_standby(req.jobsetId))
    else:
        manager.terminate_mc_proc()
        asyncio.create_task(Signaler(manager.ws).signal_standby(req.jobsetId))
        


@router.post("/wfc", summary="write and run flowchart")
async def write_and_run_flowchart(request: PostWFC):
    # create message for front-end to indicate we are running pre-job operations
    if request.precompile:
        await asyncio.create_task(
            precompile(
                fc=request.fc,
                jobset_id=request.jobsetId,
                node_delay=request.nodeDelay,
                maximum_runtime=request.maximumRuntime,
                path_to_requirements="requirements-precompiled.txt",
                is_ci=False,
                upload=False,
                port=request.selectedPort,
                signaler=Signaler(manager.ws),
            )  
        )
    else:
        await prepare_jobs_and_run_fc(request=request, manager=manager)


@router.post("/mc_upload", summary="upload the program to the selected microcontroller")
async def upload_flow(request: PostWFC):
    await precompile(
        fc=request.fc,
        jobset_id=request.jobsetId,
        node_delay=request.nodeDelay,
        maximum_runtime=request.maximumRuntime,
        path_to_requirements="requirements-precompiled.txt",
        is_ci=False,
        upload=True,
        port=request.selectedPort,
        signaler=Signaler(manager.ws),
    )
