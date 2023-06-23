from typing import Callable
from types import ModuleType
import importlib.util
import os
from build_ast import get_pip_dependencies, make_manifest_ast
import yaml
import importlib
import ast
from manifest import make_manifest_for

from flojoy_mock import DataContainer, Matrix


NODES_DIR = "PYTHON/nodes"
MANIFEST_DIR = "manifest"


def get_nodes_files(root_dir: str) -> list[str]:
    result = []

    for root, _, files in os.walk(root_dir):
        if root == root_dir:
            continue

        node_files = filter(
            lambda file: file.endswith(".py") and file[:-3].isupper(), files
        )

        for file_name in node_files:
            file_path = os.path.join(root, file_name)
            result.append(file_path)

    return result


def get_node_function(path: str) -> Callable:
    module_name = path[:-3].replace(os.sep, ".")
    module = importlib.import_module(module_name)

    func_name = os.path.basename(path)[:-3]
    return getattr(module, func_name)


def main():
    if not os.path.exists(MANIFEST_DIR):
        os.mkdir(MANIFEST_DIR)

    tree = make_manifest_ast("test.py")
    code = compile(tree, filename="<unknown>", mode="exec")
    module = ModuleType("node_module")
    exec(code, module.__dict__)

    func = getattr(module, "FOO")
    manifest = make_manifest_for("ARITHMETIC", func)

    pip_deps = get_pip_dependencies(tree)
    if pip_deps:
        manifest["COMMAND"][0]["pip_dependencies"] = pip_deps

    with open(os.path.join(MANIFEST_DIR, "test.manifest.yaml"), "w") as f:
        yaml.safe_dump(manifest, f, sort_keys=False, indent=2)

    # for node_file in get_nodes_files(NODES_DIR):
    #     try:
    #         func = get_node_function(node_file)
    #     except ModuleNotFoundError:
    #         print(f"Failed to import {node_file}, probably missing dependencies")
    #         continue
    #
    #     # The folder before the node folder
    #     node_type = node_file[:-3].split(os.sep)[-2]
    #     manifest = make_manifest_for(node_type, func)


if __name__ == "__main__":
    main()
