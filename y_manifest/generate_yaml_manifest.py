from typing import Callable
from types import ModuleType
import importlib.util
import os
from typing import TypeVar, Generic
from build_ast import make_manifest_ast
import ast
import inspect
import importlib
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
    sig = inspect.signature(func)
    params = sig.parameters
    for name, param in params.items():
        print(
            f"{name}: annotation: {param.annotation}, is DataContainer: {issubclass(param.annotation, DataContainer)}"
        )

    # manifest = make_manifest_for("ARITHMETIC", FOO)
    # with open(os.path.join(MANIFEST_DIR, "test.manifest.yaml"), "w") as f:
    #     yaml.safe_dump(manifest, f, sort_keys=False, indent=2)

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
