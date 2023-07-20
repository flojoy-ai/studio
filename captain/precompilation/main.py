import json
import os
from captain.precompilation.flojoy_script_builder import FlojoyScriptBuilder
from captain.precompilation.precompilation_utils import create_topology
from captain.precompilation.templates import get_missing_pip_packages
from captain.types.flowchart import PostWFC
from flojoy.utils import clear_flojoy_memory


def precompile(request: PostWFC, path_to_output: str, is_ci: bool = False):

    # Step 0 : pre-precompile operations
    sw = FlojoyScriptBuilder()
    flowchart_as_dict = json.loads(request.fc)
    topology = create_topology(flowchart_as_dict, request.jobsetId, request.nodeDelay, request.maximumRuntime)
    clear_flojoy_memory()

    # Step 1: add necessary pip packages
    sw.install_missing_pip_packages(flowchart_as_dict['nodes'])

    # Step 2 : get imports for node functions
    sw.import_app_nodes(topology, path_to_output, is_ci)

    # Step 3 : insert node execution logic
    # sw.insert_node_execution_logic(topology)

    sw.write_to_file(os.path.join(path_to_output, "test.py"))