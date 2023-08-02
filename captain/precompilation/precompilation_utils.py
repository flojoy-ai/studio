from typing import Any
from captain.models.topology import Topology
from captain.precompilation.templates.classes.LightTopology import LightTopology
from captain.precompilation.templates.functions.flowchart_to_graph import flowchart_to_graph
from captain.utils.flowchart_utils import flowchart_to_nx_graph


def create_light_topology(
    topology_dict: dict[str, Any], jobset_id: str, node_delay: float, max_runtime: float
):
    graph = flowchart_to_nx_graph(topology_dict)
    node_id_to_func = get_node_id_to_func(graph)
    graph = flowchart_to_graph(topology_dict) # use light DiGraph class instead of networkx
    return LightTopology(
        graph=graph,
        jobset_id=jobset_id,
        node_id_to_func=node_id_to_func,
    )


# this is in utils, do not make method inside of class for this since
# it needs to be as light as possible
def get_graph_nodes(topology: LightTopology):
    return topology.original_graph.get_nodes()


def extract_pip_packages(nodes: list):
    packages = []
    for node in nodes:
        if "pip_dependencies" not in node["data"]:
            continue
        for package in node["data"]["pip_dependencies"]:
            pckg_str = (
                f"{package['name']}=={package['v']}"
                if "v" in package
                else f"{package['name']}"
            )
            packages.append(pckg_str)
    return packages


def get_node_id_to_func(graph):
    """
    TODO: Currently, create topology object and get node_id_to_func from there.
    This is not ideal, very hacky.
    """
    topology = Topology(graph, "")
    return topology.pre_import_functions()
