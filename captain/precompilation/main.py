import json
from captain.precompilation.flojoy_script_builder import FlojoyScriptBuilder
from captain.precompilation.precompilation_utils import create_topology, get_missing_pip_packages, import_app_nodes
from captain.types.flowchart import PostWFC
from flojoy.utils import clear_flojoy_memory


def precompile(request: PostWFC, path_to_nodes_module: str, is_ci: bool = False) -> str:

    # Step 0 : pre-compile operations
    sw = FlojoyScriptBuilder()
    flowchart_as_dict = json.loads(request.fc)
    topology = create_topology(flowchart_as_dict, request.jobsetId, request.nodeDelay, request.maximumRuntime)
    clear_flojoy_memory()

    # Step 1: add necessary pip packages
    sw.install_missing_pip_packages(json.loads(flowchart_as_dict['nodes']))

    # Step 2 : get imports for node functions
    sw.import_app_nodes(topology, path_to_nodes_module, is_ci)

    sw.write_to_file("test.py")