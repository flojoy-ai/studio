import importlib
import os
import sys
from pathlib import Path
from typing import Any, cast

from flojoy import NoInitFunctionError, get_node_init_function

from captain.models.topology import Topology
from captain.utils.logger import logger
from captain.utils.nodes_path import get_nodes_path


def pre_import_functions(topology: Topology):
    functions = {}
    errors = {}
    for node_id in cast(list[str], topology.original_graph.nodes):
        # get the node function
        node = cast(dict[str, Any], topology.original_graph.nodes[node_id])
        cmd: str = node["cmd"]
        cmd_mock: str = node["cmd"] + "_MOCK"
        module = get_module_func(cmd)
        func_name = cmd_mock if topology.is_ci else cmd
        try:
            func = getattr(module, func_name)
        except AttributeError:
            func = getattr(module, cmd)

        preflight = next(
            (
                f
                for f in module.__dict__.values()
                if callable(f) and getattr(f, "is_flojoy_preflight", False)
            ),
            None,
        )

        if preflight is not None:
            try:
                preflight()
            except Exception as e:
                errors[node_id] = str(e)

        # check if the func has an init function, and initialize it if it does to the specified node id
        try:
            init_func = get_node_init_function(func)
            init_func.run(
                node_id, node["init_ctrls"]
            )  # node id is used to specify storage: each node of the same type will have its own storage
        except NoInitFunctionError:
            pass
        except Exception as e:
            errors[node_id] = str(e)

        functions[node_id] = func
    return functions, errors


mapping = {}


def get_module_func(file_name: str):
    nodes_dir = get_nodes_path()

    if not mapping:
        logger.info("creating nodes mapping for first time......")
        create_map()
    logger.info(f" mapping root is: {mapping.get('root')}")
    if mapping.get("root") != nodes_dir:
        logger.info(
            f"Path to nodes dir is changed creating nodes mapping again, previous path: {mapping.get('root')} and present path: {nodes_dir}"
        )
        old_parent_path = Path(os.path.abspath(mapping["root"])).parent.__str__()
        mapping["root"] = nodes_dir
        if old_parent_path in sys.path:
            sys.path.remove(old_parent_path)
        create_map()
        modules_to_delete = []
        for module_path in sys.modules:
            if module_path.startswith("nodes"):
                modules_to_delete.append(module_path)

        for module_path in modules_to_delete:
            del sys.modules[module_path]

    file_path = mapping.get(file_name)

    if file_path is not None:
        module = importlib.import_module(file_path)
        # this will pick latest changes from module always
        module = importlib.reload(module)
        return module

    else:
        logger.error(f"File {file_name} not found in subdirectories of {nodes_dir}")


def create_map():
    nodes_dir = get_nodes_path()
    parent_dir = Path(os.path.abspath(nodes_dir)).parent.__str__()
    mapping["root"] = nodes_dir
    sys.path.append(parent_dir)
    for root, _, files in os.walk(nodes_dir):
        if root == nodes_dir:
            continue

        for file in files:
            # map file name to file path
            if file.endswith(".py"):
                node_path = (
                    os.path.join(root, file[:-3]).replace("\\", "/").replace("/", ".")
                )

                mapping[file[:-3]] = node_path[node_path.rfind("nodes.") :]
