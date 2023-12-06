import os
from pathlib import Path


def get_blocks_path() -> str:
    return os.path.join(os.getcwd(), "blocks")


def get_flojoy_dir():
    dir_path = os.path.abspath(os.path.join(Path.home(), ".flojoy"))
    if not os.path.exists(dir_path):
        os.mkdir(dir_path)
    return dir_path
