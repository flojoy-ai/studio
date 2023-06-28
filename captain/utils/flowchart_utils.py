import io, time, asyncio
import json, os, sys
import networkx as nx
from multiprocessing import Process
from captain.internal.manager import Manager
from captain.models.topology import Topology
from typing import Any, cast
from rq.queue import Queue
from multiprocessing import Process

try:
    from rq_win import WindowsWorker as Worker
except ImportError:
    from rq.worker import Worker
from captain.types.flowchart import PostWFC
from captain.utils.logger import logger
from subprocess import Popen, PIPE
import importlib
from .status_codes import STATUS_CODES
from PYTHON.dao.redis_dao import RedisDao
from PYTHON.node_sdk.small_memory import SmallMemory
from captain.types.worker import WorkerJobResponse


def run_worker():
    if (
        os.environ.get("DEBUG", None) is None
        or os.environ.get("DEBUG", None) == "False"
    ):
        text_trap = io.StringIO()
        sys.stdout = text_trap
    queue = Queue("flojoy", connection=RedisDao().r)
    worker = Worker([queue], connection=RedisDao().r)
    worker.work()


def create_topology(request: PostWFC, worker_processes: list[Process]):
    graph = flowchart_to_nx_graph(json.loads(request.fc))
    return Topology(
        graph=graph,
        jobset_id=request.jobsetId,
        worker_processes=worker_processes,
        node_delay=request.nodeDelay,
        max_runtime=request.maximumRuntime,
    )


# spawns a set amount of RQ workers to execute jobs (node functions)
def spawn_workers(manager: Manager):
    if manager.running_topology is None:
        logger.error("Could not spawn workers, no topology detected")
        return
    worker_number = manager.running_topology.get_maximum_workers()
    logger.debug(f"NEED {worker_number} WORKERS")
    logger.info(f"Spawning {worker_number} workers")
    os.environ["OBJC_DISABLE_INITIALIZE_FORK_SAFETY"] = "YES"
    for _ in range(worker_number):
        worker_process = Process(target=run_worker)
        worker_process.daemon = True
        worker_process.start()
        manager.worker_processes.append(worker_process)


# converts the dict to a networkx graph
def flowchart_to_nx_graph(flowchart):
    elems = flowchart["nodes"]
    edges = flowchart["edges"]
    nx_graph: nx.DiGraph = nx.DiGraph()
    dict_node_inputs: dict[str, list] = dict()

    for i in range(len(elems)):
        el = elems[i]
        node_id = el["id"]
        data = el["data"]
        cmd = el["data"]["func"]
        ctrls = data.get("ctrls", {})
        inputs = data.get("inputs", {})
        label = data.get("label", {})
        dict_node_inputs[node_id] = inputs
        node_path = data.get("path", "")
        nx_graph.add_node(
            node_id,
            pos=(el["position"]["x"], el["position"]["y"]),
            id=el["id"],
            ctrls=ctrls,
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
        target_input = list(
            filter(lambda input: input.get("id", "") == target_label_id, v_inputs)
        )
        target_label = "default"
        if len(target_input) > 0:
            target_label = target_input[0].get("name")
        logger.debug(
            f"Adding edge from {u} to {v}\n,"
            f"inputs: {v_inputs}, chosen label: {target_label},\n"
            f"target_label_id: {target_label_id}"
        )
        nx_graph.add_edge(u, v, label=label, target_label=target_label, id=_id)

    nx.draw(nx_graph, with_labels=True)

    return nx_graph


# clears memory used by some worker nodes
def clear_memory():
    SmallMemory().clear_memory()


# run code for cleaning up memory and preparing next topology to be ran
# add more stuff if needed here:
def prepare_for_next_run():
    clear_memory()


def report_failure(job, connection, type, value, traceback):
    print(job, connection, type, value, traceback)


async def run_flow_chart(manager: Manager):
    # run the flowchart
    if manager.running_topology:
        asyncio.create_task(manager.running_topology.run())


async def prepare_jobs_and_run_fc(request: PostWFC, manager: Manager):
    pre_job_op_start = time.time()
    logger.debug(f"Pre job operation started at: {pre_job_op_start}")
    fc = json.loads(request.fc)
    # create the topology
    manager.running_topology = create_topology(request, manager.worker_processes)

    # Delete all rq jobs and cleanup memory
    manager.running_topology.cleanup()

    # get the amount of workers needed
    spawn_workers(manager)

    nodes = fc["nodes"]
    missing_packages = []
    socket_msg = WorkerJobResponse(
        jobset_id=cast(str, request.jobsetId),
        dict_item={
            "PRE_JOB_OP": {"isRunning": True, "output": ""},
        },
    )
    for node in nodes:
        if "pip_dependencies" not in node["data"]:
            continue
        for package in node["data"]["pip_dependencies"]:
            try:
                module = importlib.import_module(package["name"])
                socket_msg["PRE_JOB_OP"][
                    "output"
                ] = f"Package: {module} is already installed!"
                logger.debug(f"Package: {module} is already installed!")
                await manager.ws.broadcast(socket_msg)
            except ImportError:
                pckg_str = (
                    f"{package['name']}=={package['v']}"
                    if "v" in package
                    else f"{package['name']}"
                )
                logger.debug(f"Package: {package['name']} is missing!")
                missing_packages.append(pckg_str)

    if missing_packages:
        socket_msg["PRE_JOB_OP"][
            "output"
        ] = f"{', '.join(missing_packages)} packages will be installed with pip!"
        await manager.ws.broadcast(socket_msg)
        installation_succeed = await install_packages(
            missing_packages, socket_msg, manager=manager
        )
        logger.debug(f"installing packages was successfull? {installation_succeed}")
        if installation_succeed:
            socket_msg["PRE_JOB_OP"]["output"] = "Pre job operation successfull!"
            socket_msg["PRE_JOB_OP"]["isRunning"] = False
            socket_msg["SYSTEM_STATUS"] = (STATUS_CODES["RQ_RUN_IN_PROCESS"],)
            await manager.ws.broadcast(socket_msg)
            logger.debug(
                f"PRE JOB OPERATION TOOK {time.time() - pre_job_op_start} SECONDS TO COMPLETE"
            )
            asyncio.create_task(run_flow_chart(manager=manager))

        else:
            socket_msg["PRE_JOB_OP"][
                "output"
            ] = "Pre job opearation failed! Look at the errors printed above!"
            socket_msg["SYSTEM_STATUS"] = STATUS_CODES["PRE_JOB_OP_FAILED"]
            await manager.ws.broadcast(socket_msg)
    else:
        socket_msg["PRE_JOB_OP"]["isRunning"] = False
        socket_msg["SYSTEM_STATUS"] = STATUS_CODES["RQ_RUN_IN_PROCESS"]
        await manager.ws.broadcast(socket_msg)
        logger.debug(
            f"PRE JOB OPERATION TOOK {time.time() - pre_job_op_start} SECONDS TO COMPLETE"
        )
        asyncio.create_task(run_flow_chart(manager=manager))


def stream_response(proc):
    while True:
        line = proc.stdout.readline() or proc.stderr.readline()
        if not line:
            break
        yield line


async def install_packages(
    missing_packages: list[str], socket_msg: dict[str, Any], manager: Manager
):
    try:
        cmd = ["pip", "install"] + missing_packages
        proc = Popen(cmd, stdout=PIPE, stderr=PIPE)
        while proc.poll() is None:
            stream = stream_response(proc)
            for line in stream:
                socket_msg["PRE_JOB_OP"]["output"] = line.decode(encoding="utf-8")
                await manager.ws.broadcast(socket_msg)
        return_code = proc.returncode
        if return_code != 0:
            return False
        return True
    except Exception as e:
        output = "\n".join(e.args)
        socket_msg["PRE_JOB_OP"]["output"] = output
        await manager.ws.broadcast(socket_msg)
        return False
