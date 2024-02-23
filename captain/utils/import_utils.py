from pathlib import Path
import sys


def unload_module(path: str):
    module_name = Path(path).stem
    if module_name in sys.modules:
        del sys.modules[module_name]
