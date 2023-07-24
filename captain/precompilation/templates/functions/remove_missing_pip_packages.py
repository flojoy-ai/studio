import importlib
from subprocess import PIPE, Popen


def remove_missing_pip_packages(missing_packages: list):
    if len(missing_packages) > 0:
        cmd = ["pip", "uninstall"] + missing_packages
        proc = Popen(cmd, stdout=PIPE, stderr=PIPE)
        resp = ""
        return_code = proc.returncode
        if return_code != 0: # if not success 
            raise Exception(resp)
    return missing_packages
