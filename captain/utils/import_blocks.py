import importlib
import os
import sys
from pathlib import Path
from typing import Any, cast

from flojoy import NoInitFunctionError, get_node_init_function

from captain.models.topology import Topology
from captain.utils.logger import logger
from captain.utils.blocks_path import get_blocks_path


def pre_import_functions(topology: Topology):
    functions: dict[str, str] = {}
    errors: dict[str, str] = {}
    for block_id in cast(list[str], topology.original_graph.nodes):
        # get the block function
        block = cast(dict[str, Any], topology.original_graph.nodes[block_id])
        cmd: str = block["cmd"]
        module = get_module_func(cmd)
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
                errors[block_id] = str(e)

        # check if the func has an init function, and initialize it if it does to the specified node id
        try:
            init_func = get_node_init_function(func)
            init_func.run(
                block_id, block["init_ctrls"]
            )  # node id is used to specify storage: each node of the same type will have its own storage
        except NoInitFunctionError:
            pass
        except Exception as e:
            errors[block_id] = str(e)

        functions[block_id] = func
    return functions, errors


mapping: dict[str, str] = {}


def get_module_func(file_name: str):
    blocks_path = get_blocks_path()

    if not mapping:
        logger.info("creating blocks mapping for first time......")
        create_map(custom_blocks_dir=None)

    file_path = mapping.get(file_name)

    if file_path is not None:
        module = importlib.import_module(file_path)
        # this will pick latest changes from module always
        module = importlib.reload(module)
        return module

    else:
        logger.error(f"File {file_name} not found in subdirectories of {blocks_path}..")


def create_map(custom_blocks_dir: str | None):
    blocks_dir = custom_blocks_dir if custom_blocks_dir else get_blocks_path()

    if custom_blocks_dir:
        if "root" in mapping and mapping["root"] != blocks_dir:
            logger.info(
                f"Path to custom blocks dir is changed creating blocks mapping again, previous path: {mapping.get('root')} and present path: {blocks_dir}"
            )

            old_parent_path = Path(os.path.abspath(mapping["root"])).parent.__str__()
            mapping["root"] = blocks_dir

            if old_parent_path in sys.path:
                sys.path.remove(old_parent_path)

            modules_to_delete = [
                module_path
                for module_path in sys.modules
                if module_path.startswith("blocks")
            ]

            for module_path in modules_to_delete:
                del sys.modules[module_path]

    parent_dir = Path(os.path.abspath(blocks_dir)).parent.__str__()
    if custom_blocks_dir:
        mapping["root"] = blocks_dir

    sys.path.append(parent_dir)

    for root, _, files in os.walk(blocks_dir):
        if root == blocks_dir:
            continue

        for file in files:
            # map file name to file path
            if file.endswith(".py"):
                block_path = (
                    os.path.join(root, file[:-3]).replace("\\", "/").replace("/", ".")
                )
                parent_dir_with_dot = parent_dir.replace("\\", "/").replace("/", ".")

                mapping[file[:-3]] = block_path.replace(parent_dir_with_dot + ".", "")
