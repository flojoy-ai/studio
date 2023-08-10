import json
from precompilation.flojoy_script_builder import FlojoyScriptBuilder
from precompilation.precompilation_utils import (
    create_light_topology,
    get_graph_nodes,
)
from flojoy.utils import clear_flojoy_memory


# TODO Support node init precompilation
def precompile(
    fc: str,
    jobset_id: str,
    node_delay: float,
    maximum_runtime: float,
    path_to_output: str,
    path_to_requirements: str,
    is_ci: bool = False,
):
    """
    Precompiles a flowchart into a script that can be run on a remote machine or a microcontroller (not yet done for microcontroller).
    """

    # Step 0 : pre-precompile operations
    clear_flojoy_memory()
    sw = FlojoyScriptBuilder(path_to_output, is_ci)
    flowchart_as_dict = json.loads(fc)
    light_topology = create_light_topology(
        flowchart_as_dict, jobset_id, node_delay, maximum_runtime
    )
    sw.remove_debug_prints_and_set_offline()
    sw.validate_output_dir() 

    # Step 1: add necessary pip packages
    sw.export_base_pip_packages(
        export_dir=path_to_output, path_to_requirements=path_to_requirements
    )  # required pip packages for flowchart execution
    # sw.install_missing_pip_packages(flowchart_as_dict["nodes"]) # pip packages required only by certain nodes

    # Step 2: add import strings for node functions and import the files themselves
    sw.import_app_nodes(get_graph_nodes(light_topology))

    # Step 3: add the flowchart, and the code to run it
    sw.run_write_flowchart(fc, jobset_id)

    # Step 4: output entry point script
    sw.write_to_file()

    # Step 5: output other necessary files or modules 
    sw.write_extra_files()

    # Step 6: apply file filters to .py files
    sw.apply_filters_to_py_files_in_output_dir()

    # Step 7: compile to mpy
    # sw.compile_to_mpy() # TODO: setup for this is too complicated and it's not
                        # even necessary to run on microcontroller
