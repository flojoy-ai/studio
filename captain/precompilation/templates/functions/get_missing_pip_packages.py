import importlib
from subprocess import PIPE, Popen


def get_missing_pip_packages(packages: list):
    missing_packages = []
    for package in packages:
        try:
            importlib.import_module(package)
        except ImportError:
            missing_packages.append(package)

    if len(missing_packages) > 0:
        cmd = ["pip", "install"] + packages
        proc = Popen(cmd, stdout=PIPE, stderr=PIPE)
        resp = ""
        return_code = proc.returncode
        if return_code != 0: # if not success 
            raise Exception(resp)
