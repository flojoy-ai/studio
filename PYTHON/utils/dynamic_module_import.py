import os
from importlib import import_module

NODES_DIR = "PYTHON/nodes"  # default flojoy nodes path TODO make this configurable
NODES_MC_DIR = "PYTHON/nodes_mc" # default flojoy nodes for microcontrollers path TODO make this configurable

node_mapping = {}  # IMPORTANT NOTE: use custom mapping for precompilation
node_mc_mapping = {} 

# TODO this entire code is a huge mess, clean it UP

def get_module_path(file_name: str, custom_map: dict | None = None, mc_mode: bool = False) -> str:
    cur_mapping = {}

    # use global mapping if custom not provided
    if not custom_map:
        cur_mapping = node_mc_mapping if mc_mode else node_mapping
    else:
        cur_mapping = custom_map

    # make mapping if not already made
    if not cur_mapping:
        cur_mapping = create_map(return_map=True)

    if cur_mapping is None:
        raise Exception("ERROR: cur_mapping is None")

    file_path = cur_mapping.get(file_name)

    if file_path is not None:
        return file_path

    else:
        raise Exception(f"File {file_name} not found in subdirectories of {NODES_DIR}")


def get_module_func(file_name: str, custom_map: dict | None = None, mc_mode: bool = False):
    cur_mapping = {}

    # use global mapping if custom not provided
    if not custom_map:
        cur_mapping = node_mc_mapping if mc_mode else node_mapping
    else:
        cur_mapping = custom_map

    # make mapping if not already made
    if not cur_mapping:
        cur_mapping = create_map(return_map=True, mc_mode=mc_mode)

    if cur_mapping is None:
        raise Exception("ERROR: cur_mapping is None")

    file_path = cur_mapping.get(file_name)

    if file_path is not None:
        module = import_module(file_path)
        return module
    else:
        raise Exception(f"File {file_name} not found in subdirectories of {NODES_DIR if not mc_mode else NODES_MC_DIR}")


def create_map(return_map=False, mc_mode=False):
    print("creating a node mapping")

    global node_mapping
    global node_mc_mapping

    # walk for regular nodes 
    walk(node_mapping, NODES_DIR) # modifies node_mapping

    # walk for microcontroller nodes
    walk(node_mc_mapping, NODES_MC_DIR) # modifies node_mc_mapping

    if return_map:
        return node_mc_mapping if mc_mode else node_mapping

def walk(cur_mapping, nodes_dir):
    for root, _, files in os.walk(nodes_dir):
        if root == nodes_dir:
            continue

        for file in files:
            # map file name to file path
            if file.endswith(".py"):
                cur_mapping[file[:-3]] = (
                    os.path.join(root, file[:-3]).replace("/", ".").replace("\\", ".")
                )
