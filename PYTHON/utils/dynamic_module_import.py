import os
from importlib import import_module

NODES_DIR = "PYTHON/nodes" # default flojoy nodes path TODO make this configurable
mapping = {} # IMPORTANT NOTE: use custom mapping for precompilation


def get_module_path(file_name: str, custom_map: dict | None = None) -> str:

    cur_mapping = {}

    # use global mapping if custom not provided
    if not custom_map:
        cur_mapping = mapping
    else:
        cur_mapping = custom_map
    
    # make mapping if not already made
    if not cur_mapping:
        create_map(return_map=True)
        cur_mapping = mapping

    file_path = cur_mapping.get(file_name)

    if file_path is not None:
        return file_path
    
    else:
        raise Exception(f"File {file_name} not found in subdirectories of {NODES_DIR}")

def get_module_func(file_name: str, custom_map: dict | None = None):

    cur_mapping = {}

    # use global mapping if custom not provided
    if not custom_map:
        cur_mapping = mapping
    else:
        cur_mapping = custom_map
    
    # make mapping if not already made
    if not cur_mapping:
        create_map(return_map=True)
        cur_mapping = mapping

    file_path = cur_mapping.get(file_name)

    if file_path is not None:
        module = import_module(file_path)
        return module
    
    else:
        raise Exception(f"File {file_name} not found in subdirectories of {NODES_DIR}")


def create_map(nodes_dir=NODES_DIR, return_map=False):
    print("creating a node mapping")

    global mapping

    cur_mapping = {}
    for root, _, files in os.walk(nodes_dir):
        if root == nodes_dir:
            continue

        for file in files:
            # map file name to file path
            if file.endswith(".py"):
                cur_mapping[file[:-3]] = (
                    os.path.join(root, file[:-3]).replace("/", ".").replace("\\", ".")
                )
    
    if return_map:
        return cur_mapping
    
    mapping = cur_mapping


