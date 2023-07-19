import importlib
from subprocess import PIPE, Popen
from typing import Any
from captain.models.topology import Topology
from captain.utils.flowchart_utils import flowchart_to_nx_graph, stream_response


def create_topology(topology_dict : dict[str, Any], jobset_id: str, node_delay: float, max_runtime: float):
    graph = flowchart_to_nx_graph(topology_dict)
    return Topology(
        graph=graph,
        jobset_id=jobset_id,
        node_delay=node_delay,
        max_runtime=max_runtime,
    )


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


