import json
import os
import pickle
from captain.precompilation.flojoy_script_builder import FlojoyScriptBuilder
from captain.precompilation.precompilation_utils import (
    create_light_topology,
    get_graph_nodes,
)
from captain.precompilation.templates.classes.LightTopology import LightTopology
from captain.precompilation.templates.functions.flowchart_to_nx_graph import (
    flowchart_to_nx_graph,
)
from captain.types.flowchart import PostWFC
from flojoy.utils import clear_flojoy_memory

def precompile(request: PostWFC, path_to_output: str, is_ci: bool = False):
    '''
    Precompiles a flowchart into a script that can be run on a remote machine or a microcontroller.
    '''

    # Step 0 : pre-precompile operations
    clear_flojoy_memory()
    sw = FlojoyScriptBuilder(path_to_output, is_ci)
    flowchart_as_dict = json.loads(request.fc)
    light_topology = create_light_topology(
        flowchart_as_dict, request.jobsetId, request.nodeDelay, request.maximumRuntime
    )

    # Step 1: add necessary pip packages
    sw.install_missing_pip_packages(flowchart_as_dict["nodes"])

    # Step 2: add import strings for node functions
    sw.import_app_nodes(get_graph_nodes(light_topology))

    # Step 3: add the flowchart, run it, and write 
    #   -- Add some necessary imports --
    sw.ai("json")
    sw.ai(import_string="networkx", alias="nx")
    sw.ai(from_string="flojoy.utils", import_string="set_offline")
    #   --------------------------------
    #   -- Add the flowchart and run it --
    sw.acb("set_offline()")
    sw.afc(flowchart_to_nx_graph)
    sw.afc(LightTopology)
    sw.acb(f"LightTopology(\n\
    flowchart_to_nx_graph(json.loads({json.dumps(request.fc)})),\n\
    '{request.jobsetId}',\n\
    node_id_to_func,\n\
    {is_ci},\n\
    ).run().write_results()\
    ")
    #   ----------------------------------

    # Step 4: uninstall added pip packages
    sw.uninstall_pip_packages()

    sw.write_to_file()
