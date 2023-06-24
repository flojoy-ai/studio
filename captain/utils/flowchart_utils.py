import os, json
import networkx as nx
from multiprocessing import Process
from captain.internal.manager import Manager
from captain.models.topology import Topology
from captain.types.flowchart import PostWFC
from captain.utils.logger import logger
from PYTHON.rq_worker import start_worker

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
    for _ in range(worker_number):
        worker_process = Process(target=start_worker, args=("flojoy",))
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
