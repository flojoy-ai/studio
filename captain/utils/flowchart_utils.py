import io
import json
import networkx as nx
from multiprocessing import Process
from captain.internal.manager import Manager
from captain.models.topology import Topology
from redis import Redis
from rq.queue import Queue
from rq.worker import Worker
import os, sys
from captain.types.flowchart import PostWFC
from captain.utils.logger import logger

sys.path.append(os.path.dirname(sys.path[0]))
from PYTHON.dao.redis_dao import RedisDao


def run_worker(index):
    if (
        os.environ.get("PRINT_WORKER_OUTPUT", None) is None
        or os.environ.get("PRINT_WORKER_OUTPUT", None) == "False"
    ):
        text_trap = io.StringIO()
        sys.stdout = text_trap
    queue = Queue("flojoy", connection=RedisDao().r)
    worker = Worker([queue], connection=RedisDao().r, name=f"flojoy{index}")
    worker.work()


def create_topology(request: PostWFC, redis_client, worker_processes):
    graph = flowchart_to_nx_graph(json.loads(request.fc))
    return Topology(
        graph,
        redis_client,
        "",
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
    for i in range(worker_number):
        worker_process = Process(target=run_worker, args=(i,))
        worker_process.daemon = True
        worker_process.start()
        manager.worker_processes.append(worker_process)


# converts the dict to a networkx graph
def flowchart_to_nx_graph(flowchart):
    elems = flowchart["nodes"]
    edges = flowchart["edges"]
    nx_graph: nx.DiGraph = nx.DiGraph()
    for i in range(len(elems)):
        el = elems[i]
        node_id = el["id"]
        data = el["data"]
        cmd = el["data"]["func"]
        ctrls = data["ctrls"] if "ctrls" in data else {}
        inputs = data["inputs"] if "inputs" in data else {}
        label = data["label"] if "label" in data else {}
        nx_graph.add_node(
            node_id,
            pos=(el["position"]["x"], el["position"]["y"]),
            id=el["id"],
            ctrls=ctrls,
            inputs=inputs,
            label=label,
            cmd=cmd,
        )

    for i in range(len(edges)):
        e = edges[i]
        _id = e["id"]
        u = e["source"]
        v = e["target"]
        label = e["sourceHandle"]
        nx_graph.add_edge(u, v, label=label, id=_id)

    nx.draw(nx_graph, with_labels=True)

    return nx_graph
