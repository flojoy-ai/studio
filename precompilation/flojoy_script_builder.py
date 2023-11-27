import ast
import asyncio
from collections import deque
from copy import copy
import inspect
import glob
import os
import shutil
import subprocess
from tempfile import TemporaryDirectory

# import mpy_cross
from typing import Any, cast
from PYTHON.utils.dynamic_module_import import get_module_func, get_module_path
from captain.internal.manager import Manager
from captain.utils.broadcast import Signaler
from captain.utils.logger import logger
from precompilation.config import (
    EXTRA_FILES_DIR,
    FILES_GROUPS_TO_BE_OUTPUTTED,
    FILTERS_FOR_FILES,
    GC_THRESHOLD,
    HEADER,
)
from precompilation.exceptions.exceptions import FunctionOrClassAlreadyExists
from precompilation.precompilation_utils import extract_pip_packages
from precompilation.templates.classes.MultiDiGraph import MultiDiGraph
from precompilation.templates.classes.LightTopology import LightTopology
from precompilation.templates.functions.flowchart_to_graph import (
    flowchart_to_graph,
)
from precompilation.templates.functions.get_missing_pip_packages import (
    get_missing_pip_packages,
)
from precompilation.templates.functions.remove_missing_pip_packages import (
    remove_missing_pip_packages,
)
from precompilation.utils.path.absolute_path import get_absolute_path


class FlojoyScriptBuilder:
    """
    Class used for building the string of the flojoy script.
    """

    def __init__(
        self,
        path_to_output: str,
        jobset_id: str,
        signaler: Signaler,
        is_ci: bool = False,
    ):
        self.items = []
        self.indent_level = 0
        self.imports = set()
        self.block_imports = set()
        self.func_or_classes = set()
        self.path_to_output = path_to_output
        self.is_ci = is_ci
        self.jobset_id = jobset_id
        self.signaler = signaler

    def _add_import(
        self,
        import_string: str = "",
        alias: str | None = None,
        from_string: str | None = None,
        raw: bool = False,
        is_block_import: bool = False,
    ):
        """
        imports modules that aren't imported otherwise but necessary.
        If raw is true, import_string is added as is.
        """

        imports = self.imports if not is_block_import else self.block_imports

        if raw:
            imports.add(import_string)
            return

        if import_string == "":
            return
        if from_string:
            if alias:
                imports.add(
                    f"from {from_string} import {import_string} as {alias}"
                )
            else:
                imports.add(f"from {from_string} import {import_string}")
        else:
            if alias:
                imports.add(f"import {import_string} as {alias}")
            else:
                imports.add(f"import {import_string}")

    def _add_function_or_class(self, item: Any, add_modules: bool = True):
        """
        Add a function or class
        """
        # check if function or class has already been added
        if item.__name__ in self.func_or_classes:
            raise FunctionOrClassAlreadyExists()

        source_code_lines = inspect.getsource(item).splitlines()
        # Add the correct number of tab characters to the start of each line
        source_code_lines = [
            "\t" * self.indent_level + line for line in source_code_lines
        ]
        self.items += source_code_lines

        if add_modules:
            self._add_module_import(item)

        self.func_or_classes.add(item.__name__)

    def _add_code_block(self, block: str):
        """
        Add a code block
        """
        formatted = ["\t" * self.indent_level + line for line in block.splitlines()]
        self.items += formatted

    def _add_list(self, name: str, items: Any):
        """
        Make a list
        """
        self._add_code_block(f"{name} = []")
        for item in items:
            self._add_code_block(f"{name}.append({item})")

    def _increase_indent(self):
        """
        Increase indent level
        """
        self.indent_level += 1

    def _reduce_indent(self):
        """
        Reduce indent level
        """
        self.indent_level = max(0, self.indent_level - 1)

    def _add_dict(self, name: str, dict: dict, no_string: bool = False):
        """
        Add a dict
        """
        self._add_code_block(f"{name} = {{}}")

        for node in dict:
            if no_string:
                self._add_code_block(f"{name}['{node}'] = {dict[node]}")
            else:
                self._add_code_block(f"{name}['{node}'] = '{dict[node]}'")

    def _add_module_import(self, item):
        """
        Add module imports
        """

        file_path = inspect.getfile(item)

        with open(file_path, "r") as file:
            module_ast = ast.parse(file.read())

        for node in ast.walk(module_ast):
            if isinstance(node, ast.Import):
                for alias in node.names:
                    self.imports.add(f"import {alias.name}")
            elif isinstance(node, ast.ImportFrom):
                if node.level > 0:
                    dots = "." * node.level
                    module = f"{dots}{node.module}"
                else:
                    module = node.module
                for alias in node.names:
                    self.imports.add(f"from {module} import {alias.name}")

    def _apply_file_filters(self, file: str):
        """
        Apply filters to file.
        """
        new_file = file
        for filter, to_apply in FILTERS_FOR_FILES:
            if to_apply:
                new_file = filter(new_file)
        return new_file

    def apply_filters_to_py_files_in_output_dir(self):
        """
        Walk through the directory and apply all the file filters to python files
        """
        for root, _, files in os.walk(self.path_to_output):
            for file in files:
                if file.endswith(".py"):
                    file_path = os.path.join(root, file)
                    with open(file_path, "r") as f:
                        file_str = f.read()
                    file_str = self._apply_file_filters(file_str)
                    if file_str:  # if file_str is empty, don't write to file
                        with open(file_path, "w") as f:
                            f.write(file_str)

    def remove_debug_prints_and_set_offline(self):
        self._add_import(from_string="flojoy.utils", import_string="set_offline")
        self._add_import(from_string="flojoy.utils", import_string="set_debug_off")
        self._add_code_block("set_offline()")
        self._add_code_block("set_debug_off()")

    def write_to_file(self):
        """
        Create the final script string and output it
        """
        try:
            self.imports.remove("import gc") # make sure no duplicate import for gc
        except KeyError:
            pass
        all_items = ["import gc", f"gc.threshold({GC_THRESHOLD})"] + \
            list(self.imports)\
            + list(self.block_imports)\
                + self.items 
        
        final_string = HEADER + "\n" + "\n".join(all_items)
        filename = os.path.join(get_absolute_path(self.path_to_output), "main.py")
        with open(filename, "w") as f:
            f.write(final_string)

    def export_base_pip_packages(self, export_dir: str, path_to_requirements: str):
        """
        Export base pip packages to export_dir
        """
        subprocess.run(
            ["pip", "install", "--target", export_dir, "-r", path_to_requirements]
        )

    def install_missing_pip_packages(self, nodes: list):
        """
        Get pip packages required by certain nodes
        """
        packages = extract_pip_packages(nodes)
        self._add_function_or_class(get_missing_pip_packages)
        self._add_list("packages", packages)
        self._add_code_block("missing_pip_packages=get_missing_pip_packages(packages)")

    def uninstall_pip_packages(self):
        """
        Uninstall missing pip packages returned by install_missing_pip_packages()
        """
        self._add_function_or_class(remove_missing_pip_packages)
        self._add_code_block("remove_missing_pip_packages(missing_pip_packages)")

    def import_app_nodes(self, graph_nodes):
        """
        Import app nodes and return node-to-function mapping
        """

        # helper function to output file
        def filter_and_output(from_path, to_path):
            with open(from_path, "r") as f:
                file_str = f.read()
            with open(to_path, "w") as f:
                f.write(file_str)

        # helper function to copy file to output directory
        def copy_file_to_output_dir(path):
            output_path = os.path.join(self.path_to_output, path)
            if not os.path.exists(os.path.dirname(output_path)):
                os.makedirs(os.path.dirname(output_path))
            if os.path.isfile(path):
                filter_and_output(path, output_path)
            else:
                # walk the directory, scan for python files, and minify them
                for root, _, files in os.walk(output_path):
                    for file in files:
                        if file.endswith(".py"):
                            file_path = os.path.join(root, file)
                            filter_and_output(file_path, file_path)

        node_id_to_func = {}
        node_id_to_params = {}  # micropython doesn't have an inspect module
        self.imports.add("import sys")
        self._add_code_block(
            "sys.path.append('PYTHON')"
        )  # resolve imports inside the PYTHON folder (nodes)
        imported = set()  # keep track of imported files
        for node_id in graph_nodes:
            # -- get node module and check if CI --
            node = cast(dict[str, Any], graph_nodes[node_id])
            cmd: str = node["cmd"]
            cmd_mock: str = node["cmd"] + "_MOCK"
            func_module = get_module_func(cmd, mc_mode=True)
            node_id_to_func[node_id] = getattr(func_module, cmd).__name__
            node_id_to_params[node_id] = set(
                inspect.signature(getattr(func_module, cmd)).parameters.keys()
            )
            ci_available = False
            if self.is_ci:
                try:
                    func_mock = getattr(
                        func_module, cmd_mock
                    )  # test to see if mock function exists
                    ci_available = True
                    node_id_to_func[node_id] = func_mock.__name__
                except AttributeError:
                    pass
            # ---------------------------------------

            # -- copy module directory to output directory --
            module_path = get_module_path(cmd, mc_mode=True)
            module_path = module_path.replace(".", os.path.sep) + ".py"
            copy_file_to_output_dir(module_path)
            # ------------------------------------------------

            imported.add(module_path)

            # -- check imports of module, and import any missing files recursively (only from nodes/) --
            stack = deque()
            stack.append((ast.parse(inspect.getsource(func_module)), module_path))
            while len(stack) > 0:
                cur_module, cur_module_path = stack.pop()
                for node in ast.walk(cur_module):
                    if not (
                        isinstance(node, ast.Import) or isinstance(node, ast.ImportFrom)
                    ):
                        continue

                    module_name = (
                        node.module
                        if isinstance(node, ast.ImportFrom)
                        else node.names[0].name
                    )
                    if module_name is None:
                        raise ValueError("module name is None")

                    path = copy(cur_module_path)
                    # handle absolute import
                    if module_name.startswith("nodes."):
                        path = (
                            "PYTHON"
                            + os.path.sep
                            + module_name.replace(".", os.path.sep)
                            + ".py"
                        )

                    # handle relative import
                    elif isinstance(node, ast.ImportFrom) and node.level > 0:
                        for _ in range(node.level):
                            path = os.path.dirname(path)
                        path = os.path.join(
                            path, module_name.replace(".", os.path.sep) + ".py"
                        )

                    if not os.path.exists(path):  # is a directory
                        path = path[:-3]

                    if path in imported:
                        continue
                    copy_file_to_output_dir(path)
                    imported.add(path)
                    with open(path, "r") as f:
                        stack.append((ast.parse(f.read()), path))
            # ------------------------------------------------------------------------------------------

            # -- import module --
            module_path = module_path.replace(os.path.sep, ".")
            if ci_available:
                self._add_import(
                    f"from {module_path[:-3]} import {cmd_mock} as {cmd}",
                    raw=True,
                    is_block_import=True,
                )
            else:
                self._add_import(
                    f"from {module_path[:-3]} import {cmd}",
                    raw=True,
                    is_block_import=True,
                )
            # ------------------

        # add node_to_func to script (mapping of node_ids to function names)
        self._add_dict("node_id_to_func", node_id_to_func, no_string=True)

        # add node_to_params to script (mapping of node_ids to function parameters)
        self._add_dict("node_id_to_params", node_id_to_params, no_string=True)

    def write_extra_files(self):
        """
        Scan the templates/extra_files directory. Check if each directory name
        is in the FILES_GROUPS_TO_BE_OUTPUTTED set. If so, output the files in
        the directory to the output directory specified.
        """
        for dir in os.scandir(EXTRA_FILES_DIR):
            if not dir.is_dir():
                raise Exception(
                    "All entries in /templates/extra_files must be \
                                directories."
                )
            file_group = dir.name
            if file_group in FILES_GROUPS_TO_BE_OUTPUTTED:
                output_path = os.path.join(
                    get_absolute_path(self.path_to_output),
                    FILES_GROUPS_TO_BE_OUTPUTTED.get_output_dir_of(file_group),
                )
                for entry in os.scandir(dir.path):
                    if entry.is_file():
                        shutil.copy(entry.path, output_path)
                    elif entry.is_dir():
                        shutil.copytree(entry.path, output_path)

    def run_write_flowchart(self, fc: str, jobset_id: str):
        """
        Add the code responsible for running the flowchart
        """
        #   -- add some necessary imports --
        self._add_import("json")
        self._add_import(from_string="typing", import_string="Any") 
        #   --------------------------------
        #   -- add the flowchart and run it --
        self._add_code_block("set_offline()")
        self._add_function_or_class(MultiDiGraph)
        self._add_function_or_class(LightTopology)
        self._add_function_or_class(flowchart_to_graph, add_modules=False)
        self._add_code_block(
            f"LightTopology(\n\
        flowchart_to_graph(json.loads({repr(fc)})),\n\
        '{jobset_id}',\n\
        node_id_to_func,\n\
        node_id_to_params,\n\
        {self.is_ci},\n\
        ).run()\
        "
        )
        #   ----------------------------------

    # def compile_to_mpy(self):
    #     """
    #     Compile each file in output directory to mpy
    #     """
    #     to_remove = []
    #     for root, _, files in os.walk(self.path_to_output):
    #         for file in files:
    #             if file.endswith(".py"):
    #                 file_path = os.path.join(root, file)
    #                 logger.debug(f"Compiling {file_path} to micropython")
    #                 mpy_cross.run(file_path, stdout=subprocess.PIPE)
    #                 to_remove.append(file_path)

    #     for file in to_remove:
    #         os.remove(file)

    # TODO clean this up
    def run_script(self, tempdir: TemporaryDirectory[str], port: str, manager: Manager):
        asyncio.run(
            self.signaler.signal_script_running_microcontroller(self.jobset_id)
        )
        logger.debug(f"Temp dir {tempdir.name} contents: " + str(os.listdir(tempdir.name)))
        cmd = f"mpremote connect {port} + mount {tempdir.name} run {tempdir.name}/main.py"
        p = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True)
        manager.set_mc(p, port, play=True)
        logger.debug("set the mc_proc")
        ec = p.wait()
        stderr = p.stderr.read().decode() if p.stderr else ""
        stdout = p.stdout.read().decode() if p.stdout else ""
        if p.stderr: p.stderr.close()
        if p.stdout: p.stdout.close()
        if ec != 0:
            logger.error(f"Exit code: {ec}. Got error from MC: {stderr}")
            logger.error(f"stdout: {stdout}")
            asyncio.run(
                self.signaler.signal_prejob_output(self.jobset_id, stderr)
            )
            return
        # close tempdir
        tempdir.cleanup()
        logger.debug("done running MC")
        asyncio.run(self.signaler.signal_standby(self.jobset_id))

    # TODO clean this up
    def output(self, tempdir: TemporaryDirectory[str], port: str, path_to_output: str | None, manager: Manager):
        """
        Copy paste the temp dir into the output dir if specified
        and into the port dir if specified
        """

        if path_to_output: # output locally on computer
            try:
                shutil.copytree(tempdir.name, path_to_output)
            except Exception as e:
                logger.error(f"Error copying to output directory: {e}")
                output = "\n".join(e.args)
                asyncio.run(
                    self.signaler.signal_prejob_output(self.jobset_id, output)
                )

        if port: # output to microcontroller
            logger.debug("outputting to microcontroller")
            try:
                # first, delete all other files on microcontroller
                logger.debug("clearing mc root...")
                proc = subprocess.Popen(
                    f"mpremote connect {port} + run precompilation/templates/functions/clear_mc_root.py",
                    stdin=subprocess.PIPE,
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE,
                    shell=True
                )
                logger.debug("waiting for clear_mc_root.py to finish...")
                ec = proc.wait()
                stderr = proc.stderr.read().decode()
                stdout = proc.stdout.read().decode()
                if proc.stderr: proc.stderr.close()
                if proc.stdout: proc.stdout.close()
                logger.debug(f"finished clearing mc root with exit code: {ec}")
                if ec != 0:
                    logger.debug(f"Got error from MC: {stderr}")
                    logger.debug(f"stdout: {stdout}")
                    raise Exception("Error: ", stderr)

                # then, copy all files to microcontroller
                cmd = [
                    "cd",
                    tempdir.name,
                    ";",
                    "mpremote",
                    "connect",
                    port,
                    "+",
                    "cp",
                    "-r",
                    "./*",
                    ":",
                ]
                proc = subprocess.Popen(
                    " ".join(cmd),
                    stdin=subprocess.PIPE,
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE,
                    shell=True
                )
                manager.set_mc(proc, port)
                logger.debug(f"running command: {' '.join(cmd)}")
                ec = proc.wait()
                stderr = proc.stderr.read().decode()
                stdout = proc.stdout.read().decode()
                if proc.stderr: proc.stderr.close()
                if proc.stdout: proc.stdout.close()
                logger.debug(f"finished copying with exit code: {ec}")
                if ec != 0:
                    logger.debug(f"Got error from MC: {stderr}")
                    logger.debug(f"stdout: {stdout}")
                    raise Exception("Error: ", stderr)
            except Exception as e:
                output = "\n".join(e.args)
                asyncio.run(
                    self.signaler.signal_prejob_output(self.jobset_id, output)
                )
                return

        # close tempdir
        tempdir.cleanup()

        asyncio.run(
            self.signaler.signal_script_upload_complete_microcontroller(self.jobset_id)
        )

    def validate_output_dir(self, true_output_path):
        """
        Check if output directory does not exist yet. Raise error if it does.
        """
        if os.path.exists(get_absolute_path(true_output_path)):
            raise Exception("Output directory already exists.")
