import os
import sys

def get_absolute_path(path: str):
    """
    Get absolute path assuming entry script is ran from studio directory
    """
    return os.path.join(sys.path[0], path)