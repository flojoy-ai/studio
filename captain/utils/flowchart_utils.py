
import networkx as nx

from captain.models.topology import Topology

def cancel_flowchart_by_id(jobset_id):
    raise NotImplementedError("Function not implemented.")

#converts the graph/flowchart from a dict to a networkx graph
def create_topology(flowchart, redis_client):
    graph = flowchart_to_nx_graph(flowchart)
    return Topology(graph, redis_client)

def run_flowchart(redis_client):
    #get flowchart from redis
    flowchart = redis_client.get("FLOW_CHART")

#converts the dict to a networkx graph
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



