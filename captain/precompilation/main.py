import json
from captain.precompilation.flojoy_script_builder import FlojoyScriptBuilder
from captain.precompilation.precompilation_utils import (
    create_light_topology,
    get_graph_nodes,
)
from captain.precompilation.templates.classes.LightTopology import LightTopology
from captain.types.flowchart import PostWFC
from flojoy.utils import clear_flojoy_memory


def precompile(request: PostWFC, path_to_output: str, is_ci: bool = False):
    """
    Precompiles a flowchart into a script that can be run on a remote machine or a microcontroller.
    """

    # Step 0 : pre-precompile operations
    clear_flojoy_memory()
    sw = FlojoyScriptBuilder(path_to_output, is_ci)
    flowchart_as_dict = json.loads(request.fc)
    light_topology = create_light_topology(
        flowchart_as_dict, request.jobsetId, request.nodeDelay, request.maximumRuntime
    )
    sw.remove_debug_prints_and_set_offline()

    # Step 1: add necessary pip packages
    sw.install_missing_pip_packages(flowchart_as_dict["nodes"])

    # Step 2: add import strings for node functions
    sw.import_app_nodes(get_graph_nodes(light_topology))

    # Step 3: add the flowchart, run it, and write
    sw.run_write_flowchart(request.fc, request.jobsetId)

    # Step 4: uninstall added pip packages
    sw.uninstall_pip_packages()

    sw.write_to_file()
