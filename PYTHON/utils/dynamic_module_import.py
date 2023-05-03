import os
from importlib import import_module

nodes_dir = "PYTHON/nodes"


def get_module_func(file_name: str, func_name: str):
    file_path = None
    for root, dirs, files in os.walk(nodes_dir):
        for file in files:
            if file == f"{file_name}.py":
                file_path = (
                    os.path.join(root, file_name)
                    .replace("/", ".")
                    .replace("\\", ".")
                    .replace("PYTHON.", "")
                )
                break
        if file_path is not None:
            break

    if file_path is not None:
        module = import_module(file_path)
        return getattr(module, func_name)

    else:
        print(f"File {file_name} not found in subdirectories of {nodes_dir}")
