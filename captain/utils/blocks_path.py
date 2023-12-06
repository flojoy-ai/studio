import os
from pathlib import Path


def get_blocks_path() -> str:
    # This env is set from scripts/backend.(ps1/sh) file
    env = os.environ.get("ELECTRON_MODE", "dev")

    if env == "dev":
        return os.path.join(os.getcwd(), "blocks")

    # Refer to electron/node-pack-save.ts line-8
    blocks_path_from_file = os.path.join(get_flojoy_dir(), "blocks_path.txt")
    with open(blocks_path_from_file, "r") as f:
        blocks_path = f.read()
        return os.path.join(blocks_path, "blocks")


def get_flojoy_dir():
    dir_path = os.path.abspath(os.path.join(Path.home(), ".flojoy"))
    if not os.path.exists(dir_path):
        os.mkdir(dir_path)
    return dir_path
