import os
from importlib import import_module

NODES_DIR = "PYTHON/nodes"
mapping = {}


def get_module_func(file_name: str, func_name: str):
    if not mapping:
        create_map()
    file_path = mapping.get(file_name)

    if file_path is not None:
        module = import_module(file_path)
        return getattr(module, func_name)

    else:
        print(f"File {file_name} not found in subdirectories of {NODES_DIR}")


def create_map():
    print("creating a node mapping")
    for root, _, files in os.walk(NODES_DIR):
        if root == NODES_DIR:
            continue

        for file in files:
            # map file name to file path
            if file.endswith(".py"):
                mapping[file[:-3]] = (
                    os.path.join(root, file[:-3])
                    .replace("/", ".")
                    .replace("\\", ".")
                    .replace("PYTHON.", "")
                )
