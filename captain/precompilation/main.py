import json
import os
import pickle
from captain.precompilation.flojoy_script_builder import FlojoyScriptBuilder
from captain.precompilation.precompilation_utils import create_light_topology, get_graph_nodes
from captain.precompilation.templates.classes.LightTopology import LightTopology
from captain.types.flowchart import PostWFC
from flojoy.utils import clear_flojoy_memory


def precompile(request: PostWFC, path_to_output: str, is_ci: bool = False):

    # Step 0 : pre-precompile operations
    sw = FlojoyScriptBuilder()
    flowchart_as_dict = json.loads(request.fc)
    light_topology = create_light_topology(flowchart_as_dict, request.jobsetId, request.nodeDelay, request.maximumRuntime)
    clear_flojoy_memory()

    # Step 1: add necessary pip packages
    sw.install_missing_pip_packages(flowchart_as_dict['nodes'])

    # Step 2 : add import strings for node functions
    sw.import_app_nodes(get_graph_nodes(light_topology), path_to_output, is_ci) 

    # Step 3: add the flowchart
    sw.afc(LightTopology)
    pickled_str = pickle.dumps(light_topology).decode("latin1")
    sw.add_import(import_string="pickle")
    sw.add_import(import_string="networkx", alias="nx")
    sw.acb(f"topology = pickle.loads('{pickled_str}'.encode('latin1'))")

    # Step 3 : add node execution logic string

    # sw.insert_node_execution_logic(topology)

    sw.write_to_file(os.path.join(path_to_output, "test.py"))