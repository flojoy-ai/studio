import asyncio
import importlib.metadata
import json
import os
import time
import traceback
from queue import Queue
from subprocess import PIPE, Popen
from threading import Thread
from typing import Any, cast

import networkx as nx
from flojoy.utils import clear_flojoy_memory

from captain.internal.manager import Manager
from captain.models.topology import Topology
from captain.services.consumer.worker import Worker
from captain.services.producer.producer import Producer
from captain.types.flowchart import PostWFC
from captain.types.worker import (
    InitFuncType,
    ProcessTaskType,
    QueueTaskType,
    WorkerJobResponse,
)
from captain.utils.broadcast import Signaler
from captain.utils.import_blocks import pre_import_functions
from captain.utils.logger import logger

from .status_codes import STATUS_CODES


def run_worker(
    task_queue: Queue[Any],
    finish_queue: Queue[Any],
    imported_functions: dict[str, Any],
    observe_blocks: list[str],
    node_delay: float,
    signaler: Signaler,
):
    try:
        # TODO: Figure out a way to make this work with python threads (previously this was a Python Process)
        # if (
        #     os.environ.get("DEBUG", None) is None
        #     or os.environ.get("DEBUG", None) == "False"
        # ):
        #     text_trap = io.StringIO()
        #     sys.stdout = text_trap
        worker = Worker(
            task_queue=task_queue,
            finish_queue=finish_queue,
            imported_functions=imported_functions,
            observe_blocks=observe_blocks,
            node_delay=node_delay,
            signaler=signaler,
        )
        asyncio.run(worker.run())
    except Exception as e:
        logger.error(f"Error in worker: {e} {traceback.format_exc()}")


def run_producer(
    task_queue: Queue[Any],
    finish_queue: Queue[Any],
    process_task: ProcessTaskType,
    queue_task: QueueTaskType,
    init_func: InitFuncType,
    signaler: Signaler,
):
    try:
        producer = Producer(
            task_queue=task_queue,
            finish_queue=finish_queue,
            process_task=process_task,
            queue_task=queue_task,
            init_func=init_func,
            signaler=signaler,
        )
        asyncio.run(producer.run())
    except Exception as e:
        logger.error(f"Error in producer: {e} {traceback.format_exc()}")


def create_topology(
    request: PostWFC,
):
    graph = flowchart_to_nx_graph(json.loads(request.fc))
    return Topology(
        graph=graph,
        jobset_id=request.jobsetId,
        node_delay=request.nodeDelay / 1000,
    )


def spawn_producer(manager: Manager):
    if manager.running_topology is None:
        logger.error("Could not spawn producer, no topology detected")
        return
    producer = Thread(
        target=run_producer,
        args=(
            manager.task_queue,
            manager.finish_queue,
            manager.running_topology.process_worker_response,
            manager.running_topology.run_job,
            manager.running_topology.run,
            Signaler(manager.ws),
        ),
    )
    producer.daemon = True
    logger.debug("Starting producer")
    producer.start()


# spawns a set amount of workers to execute jobs (node functions)
def spawn_workers(
    manager: Manager,
    imported_functions: dict[str, Any],
    observe_blocks: list[str],
    node_delay: float,
    max_workers: int,
):
    if manager.running_topology is None:
        logger.error("Could not spawn workers, no topology detected")
        return
    worker_number = manager.running_topology.get_maximum_workers(
        maximum_capacity=max_workers
    )
    logger.debug(f"NEED {worker_number} WORKERS")
    logger.info(f"Spawning {worker_number} workers")
    manager.thread_count = worker_number

    signaler = Signaler(manager.ws)
    logger.debug("Starting worker")
    for _ in range(worker_number):
        worker_process = Thread(
            target=run_worker,
            args=(
                manager.task_queue,
                manager.finish_queue,
                imported_functions,
                observe_blocks,
                node_delay,
                signaler,
            ),
        )
        worker_process.daemon = True
        worker_process.start()


# converts the dict to a networkx graph
def flowchart_to_nx_graph(flowchart: dict[str, Any]):
    elems = flowchart["nodes"]
    edges = flowchart["edges"]
    nx_graph: nx.MultiDiGraph = nx.MultiDiGraph()
    dict_node_inputs: dict[str, list[Any]] = dict()

    for i in range(len(elems)):
        el = elems[i]
        node_id = el["id"]
        data = el["data"]
        cmd = el["data"]["func"]
        ctrls = data.get("ctrls", {})
        init_ctrls = data.get("initCtrls", {})
        inputs = data.get("inputs", {})
        label = data.get("label", "")
        dict_node_inputs[node_id] = inputs
        node_path = data.get("path", "")
        nx_graph.add_node(
            node_id,
            pos=(el["position"]["x"], el["position"]["y"]),
            id=el["id"],
            ctrls=ctrls,
            init_ctrls=init_ctrls,
            inputs=inputs,
            label=label,
            cmd=cmd,
            node_path=node_path,
        )

    for i in range(len(edges)):
        e = edges[i]
        _id = e["id"]
        u = e["source"]
        v = e["target"]
        label = e["sourceHandle"]
        target_label_id = e["targetHandle"]
        v_inputs = dict_node_inputs[v]
        target_input = cast(
            dict[str, str],
            next(
                filter(
                    lambda input, target_label_id=target_label_id: input.get("id", "")
                    == target_label_id,
                    v_inputs,
                ),
                None,
            ),
        )
        logger.debug(f"----target_input----\n{target_input}")
        target_label = "default"
        multiple = False
        if target_input:
            target_label = target_input.get("name", "default")
            multiple = target_input.get("multiple", False)

        logger.debug(
            f"Adding edge from {u} to {v}\n,"
            f"inputs: {v_inputs}, chosen label: {target_label},\n"
            f"target_label_id: {target_label_id}"
        )
        nx_graph.add_edge(
            u, v, label=label, target_label=target_label, id=_id, multiple=multiple
        )

    return nx_graph


# clears memory used by some worker nodes and job results
def clear_memory():
    clear_flojoy_memory()


async def prepare_jobs_and_run_fc(request: PostWFC, manager: Manager):
    pre_job_op_start = time.time()
    logger.debug(f"Pre job operation started at: {pre_job_op_start}")
    socket_msg = WorkerJobResponse(jobset_id=request.jobsetId)
    fc = json.loads(request.fc)

    def clean_up_function():
        manager.end_worker_threads()
        clear_memory()

    # clean up before next run
    clean_up_function()

    await manager.ws.broadcast(
        WorkerJobResponse(
            jobset_id=request.jobsetId, sys_status=STATUS_CODES["BUILDING_TOPOLOGY"]
        )
    )

    # Create new task queue and finish queue
    manager.task_queue = Queue()
    manager.finish_queue = Queue()

    # Create the topology
    manager.running_topology = create_topology(
        request,
    )  # pass clean up func for when topology ends

    """
    ____________________________________________________________________________
    START PRE JOB OPERATION 
    """
    logger.info("PREJOB_OP")
    pre_job_op_start = time.time()
    logger.debug(f"Pre job operation started at: {pre_job_op_start}")

    await asyncio.create_task(Signaler(manager.ws).signal_prejob_op(request.jobsetId))

    nodes = fc["nodes"]
    packages_dict = {
        package.name: package.version for package in importlib.metadata.distributions()
    }
    missing_packages: list[str] = []

    socket_msg["SYSTEM_STATUS"] = STATUS_CODES["COLLECTING_PIP_DEPENDENCIES"]
    await asyncio.create_task(manager.ws.broadcast(socket_msg))

    for node in nodes:
        if "pip_dependencies" not in node["data"]:
            continue
        for package in node["data"]["pip_dependencies"]:
            pckg = packages_dict.get(package["name"])
            if not pckg:
                pckg_str = (
                    f"{package['name']}=={package['v']}"
                    if "v" in package
                    else f"{package['name']}"
                )
                logger.debug(f"Package: {package['name']} is missing!")
                missing_packages.append(pckg_str)
            else:
                logger.debug(f"Package: {package['name']} is already installed!")

    if missing_packages:
        socket_msg["SYSTEM_STATUS"] = STATUS_CODES["INSTALLING_PACKAGES"]
        await manager.ws.broadcast(socket_msg)
        logger.info("Installing required dependencies before running the flow chart...")
        logger.info(
            f"{', '.join(missing_packages)} packages will be installed with pip!"
        )
        installation_succeed = await install_packages(missing_packages)
        logger.debug(f"installing packages was successful? {installation_succeed}")

        if not installation_succeed:
            logger.error("Pre job operation failed! Look at the errors printed above!")
            socket_msg["SYSTEM_STATUS"] = STATUS_CODES["PRE_JOB_OP_FAILED"]
            await manager.ws.broadcast(socket_msg)
            return
        logger.info("Pre job operation successful!")

    socket_msg["SYSTEM_STATUS"] = STATUS_CODES["IMPORTING_BLOCK_FUNCTIONS"]
    await manager.ws.broadcast(socket_msg)

    # get the amount of workers needed
    funcs, errs = pre_import_functions(topology=manager.running_topology)

    if errs:
        socket_msg["SYSTEM_STATUS"] = STATUS_CODES["IMPORTING_BLOCK_FUNCTIONS_FAILED"]
        logger.error(f"Preflight check failed! \n {', '.join(errs)}")
        socket_msg.FAILED_NODES = errs
        await manager.ws.broadcast(socket_msg)
        return

    logger.debug(
        f"PRE JOB OPERATION TOOK {time.time() - pre_job_op_start} SECONDS TO COMPLETE"
    )
    """
    END PRE JOB OPERATION
    ____________________________________________________________________________
    """

    socket_msg["SYSTEM_STATUS"] = STATUS_CODES["RUN_IN_PROCESS"]
    await manager.ws.broadcast(socket_msg)

    # spawn threads
    os.environ["OBJC_DISABLE_INITIALIZE_FORK_SAFETY"] = "YES"
    spawn_workers(
        manager,
        funcs,
        request.observeBlocks,
        request.nodeDelay,
        request.maximumConcurrentWorkers,
    )
    spawn_producer(manager)

    asyncio.create_task(cancel_when_max_time(manager, request))


async def cancel_when_max_time(manager: Manager, request: PostWFC):
    await asyncio.sleep(request.maximumRuntime)
    if manager.running_topology and not manager.running_topology.is_cancelled():
        logger.debug("Maximum runtime exceeded, cancelling topology")
        manager.running_topology.cancel()
        await Signaler(manager.ws).signal_max_runtime_exceeded(request.jobsetId)


def stream_response(proc: Popen[bytes]):
    while True:
        line = proc.stdout.readline() or proc.stderr.readline()  # type:ignore
        if not line:
            break
        yield line


async def install_packages(missing_packages: list[str]):
    try:
        poetry = os.environ.get("POETRY_PATH", "poetry")

        cmd = [poetry, "add"] + missing_packages
        proc = Popen(cmd, stdout=PIPE, stderr=PIPE)
        while proc.poll() is None:
            stream = stream_response(proc)
            for line in stream:
                try:
                    logger.info(line.decode())
                except Exception:
                    pass
        return_code = proc.returncode
        if return_code != 0:
            return False
        return True
    except Exception as e:
        logger.error(f"{e}{traceback.format_exc()}")
        return False
