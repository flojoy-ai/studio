import importlib
import inspect
from subprocess import PIPE, Popen
from typing import Any, cast
from PYTHON.utils.dynamic_module_import import create_map, get_module_func

from captain.models.topology import Topology
from captain.precompilation.precompilation_utils import extract_pip_packages, get_missing_pip_packages
from captain.utils.flowchart_utils import stream_response

# this class will be used to build the string the essentially consitutes the flojoy script.
class FlojoyScriptBuilder:
    def __init__(self):
        self.items = []
        self.indent_level = 0

    # add function or class
    def afc(self, item: Any):
        source_code_lines = inspect.getsource(item).splitlines()
        # Add the correct number of tab characters to the start of each line
        source_code_lines = ["\t" * self.indent_level + line for line in source_code_lines]
        source_code = "\n".join(source_code_lines)
        self.items.append(source_code)

    # Add a code block
    def acb(self, block: str):
        formatted = ['\t' * self.indent_level + line for line in block.splitlines()]
        self.items.append(formatted)

    # Make a list
    def mkl(self, name: str, items: Any):
        self.acb(f"{name} = []")
        for item in items:
            self.acb(f"{name}.append({item})")

    # Increase indent level
    def ii(self):
        self.indent_level += 1

    # Decrease indent level
    def ri(self):
        self.indent_level = max(0, self.indent_level - 1)

    def write_to_file(self, filename: str):
        with open(filename, "w") as f:
            for item in self.items:
                f.write(item)
                f.write("\n\n")  # Add a couple of newline characters between items

    def install_missing_pip_packages(self, nodes: list):
        packages = extract_pip_packages(nodes)
        self.afc(get_missing_pip_packages)
        self.mkl("packages", packages)
        self.acb("get_missing_pip_packages(packages)")

    def import_app_nodes(self, topology: Topology, path_to_nodes: str, is_ci: bool):
        self.acb(f"sys.path.append('{path_to_nodes}')") # directory pointing to nodes
        node_map = create_map(nodes_dir=path_to_nodes, return_map=True) # create a map for the node function name to file path in nodes directory 
        if node_map is None:
            raise Exception("Node map is None")
        for node in topology.original_graph.nodes:
            node = cast(dict[str, Any], topology.original_graph.nodes[node])
            cmd: str = node["cmd"]
            cmd_mock: str = node["cmd"] + "_MOCK"
            cmd_to_use = cmd
            if is_ci:
                try:
                    getattr(get_module_func(cmd, node_map), cmd_mock)
                    cmd_to_use = cmd_mock
                except AttributeError:
                    pass
            self.acb(f"from {node_map[cmd]} import {cmd_to_use}")


