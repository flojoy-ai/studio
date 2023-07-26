import networkx as nx
from typing import Any


def flowchart_to_nx_graph(flowchart: dict[str, Any]):
    elems = flowchart["nodes"]
    edges = flowchart["edges"]
    nx_graph: nx.DiGraph = nx.DiGraph()
    dict_node_inputs: dict[str, list[Any]] = dict()
    for i in range(len(elems)):
        el = elems[i]
        node_id = el["id"]
        data = el["data"]
        cmd = el["data"]["func"]
        ctrls = data.get("ctrls", {})
        inputs = data.get("inputs", {})
        label = data.get("label", "")
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
        target_input = next(
            filter(lambda input: input.get("id", "") == target_label_id, v_inputs), None
        )
        target_label = "default"
        multiple = False
        if target_input:
            target_label = target_input.get("name", "default")
            multiple = target_input.get("multiple", False)
        nx_graph.add_edge(
            u, v, label=label, target_label=target_label, id=_id, multiple=multiple
        )
    nx.draw(nx_graph, with_labels=True)
    return nx_graph
