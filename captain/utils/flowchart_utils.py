import time
import asyncio
from queue import Queue
from threading import Thread
import json
import os
import networkx as nx
from captain.services.consumer.worker import Worker
from captain.internal.manager import Manager
from captain.models.topology import Topology
from typing import Any, Callable, cast
from captain.services.producer.producer import Producer
from captain.types.flowchart import PostWFC
from captain.utils.logger import logger
from subprocess import Popen, PIPE
import importlib.metadata
from .status_codes import STATUS_CODES
from flojoy.utils import clear_flojoy_memory
from captain.types.worker import InitFuncType, ProcessTaskType, QueueTaskType, WorkerJobResponse, ModalConfig
import traceback
from captain.utils.broadcast import (
    signal_failed_nodes,
    signal_max_runtime_exceeded,
    signal_standby,
    signal_prejob_op,
    signal_current_running_node,
    signal_node_results
)
import logging


def run_worker(
    task_queue: Queue[Any],
    finish_queue: Queue[Any],
    imported_functions: dict[str, Any],
    node_delay: float,
    signal_running_node_func: Callable,
    signal_failed_node_func: Callable,
    signal_node_results_func: Callable,
):
    try:
        # TODO: Figure out a way to make this work with python threads (previously this was a Python Process)
        # if (
        #     os.environ.get("DEBUG", None) is None
        #     or os.environ.get("DEBUG", None) == "False"
        # ):
        #     text_trap = io.StringIO()
        #     sys.stdout = text_trap
        logger.debug("Starting worker")
        worker = Worker(
            task_queue=task_queue,
            finish_queue=finish_queue,
            imported_functions=imported_functions,
            node_delay=node_delay,
            signal_running_node=signal_running_node_func,
            signal_failed_node=signal_failed_node_func,
            signal_node_results=signal_node_results_func
        )
        asyncio.run(worker.run())
    except Exception as e:
        print(f"Error in worker: {e} {traceback.format_exc()}", flush=True)

def run_producer(
    task_queue: Queue[Any],
    finish_queue: Queue[Any],
    process_task: ProcessTaskType,
    queue_task: QueueTaskType,
    init_func: InitFuncType,
):
    try:
        logger.debug("Starting producer")
        producer = Producer(
            task_queue=task_queue,
            finish_queue=finish_queue,
            process_task=process_task,
            queue_task=queue_task,
            init_func=init_func,
        )
        asyncio.run(producer.run())
    except Exception as e:
        print(f"Error in producer: {e} {traceback.format_exc()}", flush=True)


def create_topology(
    request: PostWFC,
    cleanup_func: Callable[..., Any],
    final_broadcast: Callable[..., Any],
):
    graph = flowchart_to_nx_graph(json.loads(request.fc))
    return Topology(
        graph=graph,
        jobset_id=request.jobsetId,
        cleanup_func=cleanup_func,
        node_delay=request.nodeDelay / 1000,
        final_broadcast=final_broadcast,
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
        ),
    )
    producer.daemon = True
    producer.start()

# spawns a set amount of workers to execute jobs (node functions)
def spawn_workers(
    manager: Manager,
    imported_functions: dict[str, Any],
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
    
    def signal_running_node(jobset_id: str, node_id: str, func_name: str):
        asyncio.create_task(
            signal_current_running_node(manager.ws, jobset_id, node_id, func_name)
        )
    
    def signal_failed_node(jobset_id: str, node_id: str, func_name: str):
        asyncio.create_task(
            signal_failed_nodes(manager.ws, jobset_id, node_id, func_name)
        )
    
    def signal_node_res(jobset_id: str, node_id: str, func_name: str, result: dict[str, Any]):
        asyncio.create_task(
            signal_node_results(manager.ws, jobset_id, node_id, func_name, result)
        )

    for _ in range(worker_number):
        worker_process = Thread(
            target=run_worker,
            args=(
                manager.task_queue,
                manager.finish_queue,
                imported_functions,
                node_delay,
                lambda jobset_id, node_id, func_name: asyncio.create_task(
                    signal_current_running_node(manager.ws, jobset_id, node_id, func_name)
                ),
                lambda jobset_id, node_id, func_name: asyncio.create_task(
                    signal_failed_nodes(manager.ws, jobset_id, node_id, func_name)
                ),
                lambda jobset_id, node_id, func_name, result: asyncio.create_task(
                    signal_node_results(manager.ws, jobset_id, node_id, func_name, result)
                )
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
        target_input = next(
            filter(lambda input: input.get("id", "") == target_label_id, v_inputs), None
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

    def clean_up_function(is_finished: bool = False):
        manager.end_worker_threads()
        clear_memory()
        if is_finished:
            asyncio.create_task(signal_standby(manager.ws, request.jobsetId))

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
        cleanup_func=clean_up_function,
        final_broadcast=lambda: asyncio.create_task(signal_standby(manager.ws, request.jobsetId)),
    )  # pass clean up func for when topology ends



    """
    ____________________________________________________________________________
    START PRE JOB OPERATION 
    """
    logger.info("PREJOB_OP")
    pre_job_op_start = time.time()
    logger.debug(f"Pre job operation started at: {pre_job_op_start}")

    asyncio.create_task(signal_prejob_op(manager.ws, request.jobsetId))

    nodes = fc["nodes"]
    packages_dict = {
        package.name: package.version for package in importlib.metadata.distributions()
    }
    missing_packages = []

    socket_msg["SYSTEM_STATUS"] = STATUS_CODES["COLLECTING_PIP_DEPENDENCIES"]
    asyncio.create_task(manager.ws.broadcast(socket_msg))

    for node in nodes:
        node_logger = logging.getLogger(node["data"]["func"])
        handler = BroadcastNodeLogs(
            manager=manager, jobset_id=request.jobsetId, node_func=node["data"]["func"]
        )
        handler.setFormatter(logging.Formatter("%(asctime)s - %(name)s - %(message)s"))
        node_logger.addHandler(handler)
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
        await asyncio.create_task(manager.ws.broadcast(socket_msg))
        socket_msg["MODAL_CONFIG"] = ModalConfig(
            showModal=True,
            description="Installing required dependencies before running the flow chart...",
            messages=f"{', '.join(missing_packages)} packages will be installed with pip!",
        )
        await asyncio.create_task(manager.ws.broadcast(socket_msg))
        installation_succeed = await install_packages(
            missing_packages, socket_msg, manager=manager
        )
        logger.debug(f"installing packages was successful? {installation_succeed}")

        if not installation_succeed:
            socket_msg.MODAL_CONFIG[
                "messages"
            ] = "Pre job operation failed! Look at the errors printed above!"
            socket_msg["SYSTEM_STATUS"] = STATUS_CODES["PRE_JOB_OP_FAILED"]
            await asyncio.create_task(manager.ws.broadcast(socket_msg))
            return
        socket_msg.MODAL_CONFIG["messages"] = "Pre job operation successful!"
        socket_msg.MODAL_CONFIG["showModal"] = False
        await asyncio.create_task(manager.ws.broadcast(socket_msg))

    socket_msg["SYSTEM_STATUS"] = STATUS_CODES["IMPORTING_NODE_FUNCTIONS"]
    socket_msg.MODAL_CONFIG["showModal"] = False
    await asyncio.create_task(manager.ws.broadcast(socket_msg))

    # get the amount of workers needed
    funcs, errs = manager.running_topology.pre_import_functions()

    if errs:
        socket_msg["SYSTEM_STATUS"] = STATUS_CODES["IMPORTING_NODE_FUNCTIONS_FAILED"]
        socket_msg["MODAL_CONFIG"] = ModalConfig(
            showModal=True, messages=f"Preflight check failed! \n {', '.join(errs)}"
        )
        socket_msg.FAILED_NODES = errs
        await asyncio.create_task(manager.ws.broadcast(socket_msg))
        return
    
    logger.debug(
        f"PRE JOB OPERATION TOOK {time.time() - pre_job_op_start} SECONDS TO COMPLETE"
    )
    """
    END PRE JOB OPERATION
    ____________________________________________________________________________
    """

    socket_msg["SYSTEM_STATUS"] = STATUS_CODES["RUN_IN_PROCESS"]
    await asyncio.create_task(manager.ws.broadcast(socket_msg))


    # spawn threads    
    os.environ["OBJC_DISABLE_INITIALIZE_FORK_SAFETY"] = "YES"
    spawn_workers(manager, funcs, request.nodeDelay, request.maximumConcurrentWorkers)
    spawn_producer(manager)

    asyncio.create_task(cancel_when_max_time(manager, request))


async def cancel_when_max_time(manager: Manager, request: PostWFC):
    await asyncio.sleep(request.maximumRuntime)
    if manager.running_topology and not manager.running_topology.is_cancelled():
        logger.debug("Maximum runtime exceeded, cancelling topology")
        manager.running_topology.cancel()
        await signal_max_runtime_exceeded(manager.ws, request.jobsetId)


def stream_response(proc: Popen[bytes]):
    while True:
        line = proc.stdout.readline() or proc.stderr.readline()
        if not line:
            break
        yield line


async def install_packages(
    missing_packages: list[str], socket_msg: WorkerJobResponse, manager: Manager
):
    try:
        cmd = ["pip", "install"] + missing_packages
        proc = Popen(cmd, stdout=PIPE, stderr=PIPE)
        while proc.poll() is None:
            stream = stream_response(proc)
            for line in stream:
                socket_msg.MODAL_CONFIG["messages"] = line.decode(encoding="utf-8")
                await asyncio.create_task(manager.ws.broadcast(socket_msg))
        return_code = proc.returncode
        if return_code != 0:
            return False
        return True
    except Exception as e:
        output = "\n".join(e.args)
        socket_msg.MODAL_CONFIG["messages"] = output
        await asyncio.create_task(manager.ws.broadcast(socket_msg))
        return False


class BroadcastNodeLogs(logging.Handler):
    PCKG_INSTALLATION_COMPLETE = "Pip install complete. Spawning process for function"

    def __init__(self, manager: Manager, jobset_id: str, node_func: str):
        super().__init__()
        self.manager = manager
        self.jobset_id = jobset_id
        self.node_func = node_func

    def emit(self, record):
        log_entry = self.format(record)
        socket_msg = WorkerJobResponse(jobset_id=self.jobset_id)
        socket_msg["SYSTEM_STATUS"] = (
            STATUS_CODES["RUNNING_PYTHON_JOB"] + self.node_func
        )
        socket_msg["MODAL_CONFIG"] = ModalConfig(
            showModal=True, messages=log_entry, title=f"{self.node_func} logs"
        )

        if self.PCKG_INSTALLATION_COMPLETE in log_entry:
            socket_msg["MODAL_CONFIG"]["showModal"] = False
        asyncio.run(self.manager.ws.broadcast(socket_msg))
