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


def get_missing_pip_packages(packages: list):
    missing_packages = []
    for package in packages:
        try:
            importlib.import_module(package)
        except ImportError:
            missing_packages.append(package)

    if len(missing_packages) > 0:
        cmd = ["pip", "install"] + packages
        proc = Popen(cmd, stdout=PIPE, stderr=PIPE)
        resp = ""
        while proc.poll() is None:
            stream = stream_response(proc)
            for line in stream:
                resp = line.decode(encoding="utf-8") + '\n'
        return_code = proc.returncode
        if return_code != 0: # if not success 
            raise Exception(resp)
