import os
import yaml
import importlib
import importlib.util
from typing import Callable
from types import ModuleType
from build_ast import get_pip_dependencies, make_manifest_ast
from manifest import make_manifest_for


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


if __name__ == "__main__":
    main()
