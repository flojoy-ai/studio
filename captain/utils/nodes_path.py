import os
from pathlib import Path


def get_nodes_path():
    nodes_path = "PYTHON/nodes"
    # This env is set from scripts/backend.(ps1/sh) file
    env = os.environ.get("ELECTRON_MODE", "dev")

    if env != "test":
        # Refer to electron/node-pack-save.ts line-8
        nodes_path_file = os.path.join(get_flojoy_dir(), "nodes_path.txt")
        try:
            with open(nodes_path_file, "r") as f:
                nodes_path = f.read()
        except Exception:
            pass
    elif env == "test":
        nodes_path = Path(os.getcwd()).joinpath("../PYTHON/nodes").__str__()

    return nodes_path


def get_flojoy_dir():
    return os.path.abspath(os.path.join(Path.home(), ".flojoy"))
