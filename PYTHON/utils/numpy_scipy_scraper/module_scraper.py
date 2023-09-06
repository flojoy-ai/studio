import inspect
import re
import docstring_parser as parse


class FlojoyWrapper:
    """Class for creating a Flojoy wrapper of NumPy and SciPy functions.
    Run the script from the nodes directory.
    """

    INPUT_DEFAULT_DTYPE = "np.ndarray"
    FORBIDDEN_OPTIONAL_ARGS = ["x", "data", "kwargs", "comparator", "a", "A"]
    FORBIDDEN_TYPES = [
        "tuple",
        "tuple of ndarrays",
        "array-like",
        "array_like",
        "function",
        "callable",
        "sequence",
        "... array_like",
        "number or ndarray or sequence",
        "complex",
    ]
    FORBIDDEN_RETURN = [
        "tuple of ndarrays",
    ]

    def __init__(self, func, parameters, module, argument_names):
        """We'll use parameters to get the actual default values of the
        arguments for generating the manifest.
        """
        self.name = func.__name__
        self.org_docs = func.__doc__
        self.doc = func.__doc__
        self.count_returns()
        self.arguments = argument_names
        self.optional_argument_dict = parameters
        self.module = module
        try:
            self.first_argument = argument_names[0]
            self.parameters = {
                self.first_argument: {
                    "dtype": self.INPUT_DEFAULT_DTYPE,
                    "optional": False,
                }
            }
        except IndexError:  # this means argument_names is none
            self.first_argument = None
            self.parameters = {}
        self.data = f"from flojoy import OrderedPair, flojoy, Matrix, Scalar\n"
        self.data += f"import numpy as np\n"
        self.data += f"from collections import namedtuple\n"
        self.data += "from typing import Literal\n\n"
        self.data += f"import {module.__name__}\n\n\n"
        self.data += f"@flojoy(node_type='default')"
        self.data += f"\ndef {self.name.upper()}(\n\t"
        self.data += f"default: OrderedPair | Matrix,\n\t"

        for idk, arg in enumerate(self.arguments):
            if arg not in self.FORBIDDEN_OPTIONAL_ARGS:
                dtype = ""
                try:  # try to read it from the inspect dictionary
                    dtype = type(self.optional_argument_dict[arg]).__name__
                except:
                    pass

                try:
                    def_val = str(self.optional_argument_dict[arg])
                except:
                    def_val = "None"
                def_val = "" if def_val == "None" else def_val

                if dtype == "" or dtype == "NoneType":
                    for idl, line in enumerate(self.doc.split("\n")):
                        if f"{arg} :" in line:
                            dtype = (
                                line.split(":")[1]
                                .split(",")[0]
                                .strip()
                                .replace("}", "")
                                .replace("{", "")
                                .replace("(", "")
                                .replace(")", "")
                            )
                            break
                # now check for not allowed types after identifying them all:
                if dtype in self.FORBIDDEN_TYPES:
                    # print(
                    #     "#CANNOT PROCESS ",
                    #     self.name,
                    #     "since",
                    #     dtype,
                    #     "is not allowed ...",
                    # )
                    self.data = ""
                    return

                if dtype in ["None or float", "float or array_like"]:
                    dtype = "float"

                if dtype == "str":
                    def_val = f"'{def_val}'"

                if dtype != "None" and def_val != "":
                    self.data += f"{arg}: {dtype} = {def_val},\n\t"
                elif dtype == "int" and def_val == "":
                    self.data += f"{arg}: {dtype} = 2,\n\t"
                elif dtype == "float" and def_val == "":
                    self.data += f"{arg}: {dtype} = 0.1,\n\t"
                elif dtype not in ["int", "float", "None"] and def_val == "":
                    self.data += f"{arg}: {dtype},\n\t"
                else:
                    self.data = ""

                self.parameters[arg] = {"dtype": dtype, "optional": True}

                doc = parse.parse_from_object(func)
                for i in range(len(doc.many_returns)):
                    return_type = doc.many_returns[i].type_name
                    if return_type in self.FORBIDDEN_RETURN:
                        self.data = ""
                        return

            # mvsdist and bayes_mvs both are incompatiable currently.
            if "mvs" in self.name:
                self.data = ""
                return

        if self.decomp_return:
            self.gen_return_options()
            self.data += f"select_return: Literal"
            self.data += f"{self.return_options}"
            self.data += f' = "{self.return_options[0]}",'

        self.data += ") -> OrderedPair | Matrix | Scalar:\n\t"
        self.process_docstring()
        self.custom_params()
        self.write_test_script()

    def process_docstring(self):
        for idl, line in enumerate(self.doc.split("\n")):
            if "Returns" in line:
                break
        self.doc = "\n" + (
            "\n".join(
                [
                    ("\t" if (":" in line or "----------" in line) else "\t\t")
                    + line.lstrip(" ")
                    for line in self.doc.split("\n")[:idl]
                ]
            ).replace("\tParameters", "Parameters")
        )

        if self.decomp_return:
            replace = "Parameters\n\t----------"
            replace += "\n\tselect_return : This function has returns multiple"
            replace += f" objects:\n\t\t{self.return_options}. "
            replace += "Select the desired one to return.\n\t\t"
            replace += "See the respective function docs for descriptors."
            self.doc = self.doc.replace("Parameters\n\t----------", replace)

        self.doc = self.doc[:-2]
        self.doc += "\n\tReturns\n\t----------\n\t"
        self.doc += "DataContainer:\n\t\t"
        self.doc += "type 'ordered pair', 'scalar', or 'matrix'"
        self.doc = self.doc.replace("as follows:\n\n\t\t\n\t\t", "as follows:\n\n\t\t")

    def write_func_args(self):
        for idk, arg in enumerate(self.arguments):
            if arg not in self.FORBIDDEN_OPTIONAL_ARGS:
                dtype = ""
                try:  # try to read it from the inspect dictionary
                    dtype = type(self.optional_argument_dict[arg]).__name__
                except:
                    pass
                if dtype == "" or dtype == "NoneType":
                    for idl, line in enumerate(self.doc.split("\n")):
                        if f"{arg} :" in line:
                            dtype = (
                                line.split(":")[1]
                                .split(",")[0]
                                .strip()
                                .replace("}", "")
                                .replace("{", "")
                                .replace("(", "")
                                .replace(")", "")
                            )
                            break
                # now check for not allowed types after identifying them all correctly:
                if dtype in self.FORBIDDEN_TYPES:
                    # print(
                    #     "#CANNOT PROCESS ",
                    #     self.name,
                    #     "since",
                    #     dtype,
                    #     "is not allowed ...",
                    # )
                    self.data = ""

                else:
                    if "ndarray" in dtype:
                        dtype = "np.ndarray"
                        self.data = "import numpy as np" + self.data
                    self.data += f"{arg}={arg},\n\t\t"

                    self.parameters[arg] = {"dtype": dtype, "optional": True}
                    self.data += "\t" if idk < len(self.arguments) - 1 else ""

    def gen_return_options(self):
        self.return_options = re.findall(r"    (.*?) : ", self.return_doc)

    def count_returns(self):
        self.decomp_return = False
        search = "    Returns\n    -------"
        find1 = self.org_docs.find(search)
        find2 = self.org_docs.find("-----", find1 + len(search))
        self.return_doc = self.org_docs[find1:find2]
        self.return_count = self.return_doc.count(" : ")
        if self.return_count > 1:
            self.decomp_return = True

    def write_wrapper(self, mtype):
        if "callable" in self.doc:
            # print(
            # 	"#CANNOT PROCESS ",
            # 	self.name,
            # 	"since",
            # 	"callable",
            # 	"is not allowed ...",
            # )
            self.data = ""
            return
        self.data += f"""'''The {self.name.upper()} node is based on a numpy or scipy function."""
        self.data += """\n\tThe description of that function is as follows:\n"""
        self.data += self.doc
        self.data += "\n\t" + """'''""" + "\n\n"

        if self.module.__name__ == "numpy.linalg":
            self.data = self.data.replace(
                "OrderedPair | Matrix | Scalar", "Matrix | Scalar"
            )
            self.data = self.data.replace("OrderedPair | Matrix", "Matrix")
            self.data = self.data.replace(
                "import OrderedPair, flojoy,", "import flojoy,"
            )

            self.data += f"\tresult = {self.module.__name__}.{self.name}(\n\t\t\t" + (
                f"{self.first_argument}=default.m,\n\t\t\t"
                if self.first_argument is not None
                else ""
            )
            self.write_func_args()
            self.data += ")\n"

            if self.decomp_return:
                self.gen_return_options()
                self.data += f"\n\treturn_list = {self.return_options}"
                self.data += "\n\tif isinstance(result, tuple):"
                self.data += "\n\t\tres_dict = {}"
                self.data += "\n\t\tnum = min(len(result), len(return_list))"
                self.data += "\n\t\tfor i in range(num):"
                self.data += "\n\t\t\tres_dict[return_list[i]] = result[i]"
                self.data += "\n\t\tresult = res_dict[select_return]"

                self.data += "\n\telse:"
                self.data += "\n\t\tresult = result._asdict()"
                self.data += "\n\t\tresult = result[select_return]\n"

            self.data += "\n\tif isinstance(result, np.ndarray):\n\t\t"
            self.data += "result = Matrix(m=result)"
            self.data += "\n\telse:\n\t\t"
            self.data += "assert isinstance(\n\t\t\t"
            self.data += "result, np.number| float | int\n\t\t"
            self.data += "), f'Expected np.number, float or int "
            self.data += "for result, got {type(result)}'\n\t\t"
            self.data += "result = Scalar(c=float(result))\n\t"

        # elif self.module.__name__ == "numpy.matlib":  # TODO add matlib

        else:
            self.data += f"\tresult = {self.module.__name__}.{self.name}(\n\t\t\t" + (
                f"{self.first_argument}=default.y,\n\t\t\t"
                if self.first_argument is not None
                else ""
            )
            self.write_func_args()
            self.data += ")\n"

            if self.decomp_return:
                self.gen_return_options()
                self.data += f"\n\treturn_list = {self.return_options}"
                self.data += "\n\tif isinstance(result, tuple):"
                self.data += "\n\t\tres_dict = {}"
                self.data += "\n\t\tnum = min(len(result), len(return_list))"
                self.data += "\n\t\tfor i in range(num):"
                self.data += "\n\t\t\tres_dict[return_list[i]] = result[i]"
                self.data += "\n\t\tresult = res_dict[select_return]"

                self.data += "\n\telse:"
                self.data += "\n\t\tresult = result._asdict()"
                self.data += "\n\t\tresult = result[select_return]\n"

            self.data += "\n\tif isinstance(result, np.ndarray):\n\t\t"
            self.data += "result = OrderedPair(x=default.x, y=result)"
            self.data += "\n\telse:\n\t\t"
            self.data += "assert isinstance(\n\t\t\t"
            self.data += "result, np.number| float | int\n\t\t"
            self.data += "), f'Expected np.number, float or int "
            self.data += "for result, got {type(result)}'\n\t\t"
            self.data += "result = Scalar(c=float(result))\n\t"

        # self.data += ")\n\t)\n"
        self.data += "\n\treturn result\n"

    def custom_params(self):
        """Some nodes require custom param defaults for testing.
        This corrects those nodes with node_replace.txt.
        """
        nodename = self.name.upper()
        filename = f"{os.path.dirname(__file__)}/scraper/node_replace.txt"
        replace = np.loadtxt(filename, delimiter="\t", dtype=str, skiprows=1).T
        if nodename in replace[0]:
            # print(repr(self.data[272:311]))
            index = list(replace[0]).index(nodename)
            to_replace = replace[1][index].replace("/n/t", "\n\t")
            replacement = replace[2][index].replace("/n/t", "\n\t")
            self.data = self.data.replace(to_replace, replacement)

    def write_test_script(self):
        nodename = self.name.upper()

        self.test_script = "import numpy as np\n"
        self.test_script += "from flojoy import OrderedPair, Matrix, Scalar\n\n"
        self.test_script += f"def test_{nodename}(mock_flojoy_decorator):"
        self.test_script += f"\n\timport {nodename}\n\n\t"

        if self.module.__name__ == "numpy.linalg":
            self.test_script += "array1 = np.eye(5)\n\t"
            self.test_script += "array2 = np.eye(9)\n\t"
            self.test_script += "array2.shape = (3, 3, 3, 3)\n\n\t"
            self.test_script += "try:\n\t\t"
            self.test_script += "element_a = Matrix(m=array1)\n\t\t"
            self.test_script += f"res = {nodename}.{nodename}(default=element_a)\n\t"
            self.test_script += "except np.linalg.LinAlgError:\n\t\t"
            self.test_script += "element_a = Matrix(m=array2)\n\t\t"
            self.test_script += f"res = {nodename}.{nodename}(default=element_a)\n\n"

        else:
            self.test_script += "element_a = OrderedPair(x="
            self.test_script += "np.ones(50), y=np.arange(1, 51))\n\t"
            self.test_script += f"res = {nodename}.{nodename}(default=element_a)\n\t"

        self.test_script += (
            "\n\n\t# check that the outputs are one of the correct types."
        )
        self.test_script += (
            "\n\tassert isinstance(res, Scalar | OrderedPair | Matrix)\n"
        )

        # Some nodes tests require custom inputs for testing.
        filename = f"{os.path.dirname(__file__)}/scraper/test_replace.txt"
        replace = np.loadtxt(filename, delimiter="\t", dtype=str, skiprows=1).T
        if nodename in replace[0]:
            index = list(replace[0]).index(nodename)
            to_replace = replace[1][index]
            replacement = replace[2][index]
            self.test_script = self.test_script.replace(to_replace, replacement)


def scrape_function(func):
    signature = inspect.signature(func)
    param_names = [p.name for p in signature.parameters.values()]
    default_optional_params = {
        k: val.default
        for k, val in signature.parameters.items()
        if val.default != inspect.Parameter.empty
    }
    return func, param_names, default_optional_params


if __name__ == "__main__":
    import os
    from pathlib import Path
    import scipy
    import ast
    import numpy as np

    MODULES_TO_SCRAPE = {
        "scipy": [scipy.signal, scipy.stats],
        "numpy": [np.linalg],
    }

    CWD = os.getcwd()
    return_two = []
    for module in MODULES_TO_SCRAPE.keys():
        MODULE_DIR = Path(CWD) / Path(f"{module.upper()}")
        MODULE_DIR.mkdir(exist_ok=True)
        for submodule in MODULES_TO_SCRAPE[module]:
            invalids = []
            valids = []
            submodule_name = submodule.__name__.split(".")[-1]
            NODE_DIR = MODULE_DIR / Path(f"{submodule_name.upper()}")
            NODE_DIR.mkdir(exist_ok=True)

            # Use inspect to function params, arg names, etc.
            for name, func in inspect.getmembers(submodule, inspect.isfunction):
                _, all_arg_names, default_optional_params = scrape_function(func)
                # for the random library we need to check if there are-
                # any input arguments at all!
                func_is_valid = False
                if not all_arg_names:
                    func_is_valid = True
                else:
                    if (all_arg_names[0] in ["x", "data", "A", "a"]) and (
                        "y" not in all_arg_names
                        and "plot" not in all_arg_names
                        and "b" not in all_arg_names
                    ):
                        func_is_valid = True

                # Create object (above) for each function
                if func_is_valid:
                    fw = FlojoyWrapper(
                        func, default_optional_params, submodule, all_arg_names
                    )
                    fw.write_wrapper(f"{module.upper()}_{submodule_name.upper()}")
                    if fw.data != "" and "NoneType" not in fw.data:
                        try:
                            valid = ast.parse(fw.data)  # Test node script.
                            this_nodes_directory = Path(NODE_DIR / f"{fw.name.upper()}")
                            this_nodes_directory.mkdir(exist_ok=True)

                            # Write node script.
                            script_name = f"{fw.name.upper()}.py"
                            with open(this_nodes_directory / script_name, "w") as fh:
                                fh.write(fw.data)

                            # Write testing script.
                            test_name = f"{fw.name.upper()}_test_.py"
                            with open(this_nodes_directory / test_name, "w") as fh:
                                fh.write(fw.test_script)

                            valids.append(fw.name)

                        except SyntaxError:
                            invalids.append(fw.name)

                        # Debug section: create node scripts with errors.

                        # this_nodes_directory = Path(NODE_DIR / f"{fw.name.upper()}")
                        # this_nodes_directory.mkdir(exist_ok=True)
                        # with open(
                        #     this_nodes_directory / f"{fw.name.upper()}.py", "w"
                        # ) as fh:
                        #     fh.write(fw.data)

            print("invalids: ", invalids)
            print("valids: ", valids)
            print(
                f"Created nodes for {len(valids)} out of {len(valids) + len(invalids)} functions."
            )
            with open(NODE_DIR / "__init__.py", "w") as fh:
                functions = "__all__ = ["
                for name in valids:
                    functions += '"' + name.upper() + '", '
                functions = functions[:-2] + "]\n"
                fh.write(functions)
