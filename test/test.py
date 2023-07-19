import importlib
from subprocess import Popen
from subprocess import PIPE
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
packages = []
get_missing_pip_packages(packages)
from PYTHON.nodes.GENERATORS.SIMULATIONS.SINE import SINE
from PYTHON.nodes.GENERATORS.SIMULATIONS.LINSPACE import LINSPACE
from PYTHON.nodes.GENERATORS.SIMULATIONS.CONSTANT import CONSTANT
from PYTHON.nodes.LOGIC_GATES.TERMINATORS.END import END
from PYTHON.nodes.TRANSFORMERS.ARITHMETIC.ADD import ADD
from PYTHON.nodes.VISUALIZERS.PLOTLY.HISTOGRAM import HISTOGRAM
from PYTHON.nodes.VISUALIZERS.PLOTLY.SCATTER import SCATTER
from PYTHON.nodes.GENERATORS.SIMULATIONS.RAND import RAND
