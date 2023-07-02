import ast
from typing import Any, Callable, Optional


def extract_function_from_file(file_path: str, function_name: str):
    with open(file_path, "r") as file:
        tree = ast.parse(file.read())

    function_node = None
    for node in ast.walk(tree):
        if isinstance(node, ast.FunctionDef):
            if node.name == function_name:
                print("node name: ", node.name)
                function_node = node
                break

    if function_node is None:
        raise ValueError(f"Function '{function_name}' not found in file '{file_path}'")
    tree.body = [function_node]
    return tree
    # start_lineno = function_node.lineno
    # end_lineno = function_node.end_lineno
    # with open(file_path, 'r') as file:
    #     lines = file.readlines()

    # function_lines = lines[start_lineno - 1 : end_lineno]
    # function_string = ''.join(function_lines)

    # return function_string


def create_parameter_hashmap_from_string(function_string: str):
    tree = ast.parse(function_string)
    function_def = next(
        (node for node in ast.walk(tree) if isinstance(node, ast.FunctionDef)), None
    )

    if not function_def:
        raise ValueError("Invalid function string")

    parameter_hashmap = {}

    for arg in function_def.args.args:
        param_name = arg.arg

        try:
            param_annotation = ast.get_source_segment(function_string, arg)
            annotation = param_annotation.split(":")[1]
        except AttributeError:
            param_annotation = ""

        parameter_hashmap[param_name] = annotation.strip()

    return parameter_hashmap


def find(collection: list[Any], predicate: Callable[[Any], bool]) -> Optional[Any]:
    return next(filter(predicate, collection), None)


from flojoy import DataContainer


class Parameter:
    param_type: str
    default_value: Any

    def __init__(self, type: str, default_value: Any, options: list[str] | None = None):
        self.param_type = type
        self.default_value = default_value
        if options:
            self.options = options

    def to_dict(self):
        dict_value: dict[str, Any] = {}
        for attr, value in vars(self).items():
            if not attr.startswith("_"):
                dict_value[attr] = value
        return dict_value


class InputOutput:
    name: str
    id: str
    type: str

    def __init__(self, name: str, type: str):
        self.name = name
        self.id = name
        self.type = type

    def to_dict(self):
        dict_value: dict[str, Any] = {}
        for attr, value in vars(self).items():
            if not attr.startswith("_"):
                dict_value[attr] = value
        return dict_value


import json


def get_default_value(defaults: list[ast.expr], args: list[ast.arg], index: int):
    defautls_index = len(defaults) - (len(args) - index)
    if defautls_index < 0:
        raise ValueError(
            "Default value must be given for parameters. "
            + f"A default value for parameter: '{args[index].arg}' was not found!",
        )
    default_val = defaults[len(defaults) - (len(args) - index)]
    d_v = ""
    if isinstance(default_val, ast.Constant):
        d_v = default_val.value
    if isinstance(default_val, ast.List):
        d_v = ""
    return d_v


import re


def to_pascal_case(string: str):
    words = re.split(r"[_\s]|(?=[A-Z])", string)
    pascal_case = "".join(word.capitalize() for word in words)
    return pascal_case


ALL_DC_CLASSES = [
    to_pascal_case(dc_type) for dc_type in DataContainer.allowed_types
] + ["DataContainer"]


def check_binop_and_return_type(binop: ast.BinOp, arg: ast.arg):
    input_type = []
    if binop.right.id not in ALL_DC_CLASSES:
        raise ValueError(
            "All values in Union type must be DataContainer class or subclass of DataContainer!"
            + f"{binop.right.id} is found for parameter: '{arg.arg}'",
        )
    input_type.append(binop.right.id)
    if isinstance(binop.left, ast.BinOp):
        left_type = check_binop_and_return_type(binop.left, arg)
        input_type = input_type + left_type
        return input_type
    if binop.left.id not in ALL_DC_CLASSES:
        raise ValueError(
            "All values in Union type must be DataContainer class or subclass of DataContainer!"
            + f"{binop.left.id} is found for parameter: '{arg.arg}'",
        )
    input_type.append(binop.left.id)
    return input_type


def get_parameters_hashmap(tree: ast.Module):
    flojoy_node = find(tree.body, lambda node: isinstance(node, ast.FunctionDef))
    if not flojoy_node:
        raise ValueError("No flojoy node found in file")
    args: list[ast.arg] = flojoy_node.args.args
    defaults: list[ast.expr] = flojoy_node.args.defaults
    hashmap: dict[str, dict[str, Any]] = {"input": {}, "param": {}, "output": {}}
    for i in range(len(args)):
        arg = args[i]
        # Case 1. Single type annotation  used
        if isinstance(
            arg.annotation, ast.Name
        ):  # single type annotation check if its DC type
            if arg.annotation.id in ALL_DC_CLASSES:
                # ! This is an input
                # this is an input parameter
                hashmap["input"][arg.arg] = InputOutput(
                    name=arg.arg, type=arg.annotation.id
                ).to_dict()
            elif arg.annotation.id == "DefaultParams":
                continue
            else:
                raise ValueError(
                    f"Unknown parameter added to node function: '{arg.arg}'"
                )
        # Case 2. Union type separated by "|" used
        elif isinstance(arg.annotation, ast.BinOp):  # check if all side have DC type
            input_type_list = check_binop_and_return_type(arg.annotation, arg)
            joined_type = "|".join(input_type_list)
            hashmap["input"][arg.arg] = InputOutput(
                name=arg.arg, type=joined_type
            ).to_dict()
            print("input type list: ", input_type_list)
        # Case 3. Attribute from a class is used
        elif isinstance(
            arg.annotation, ast.Attribute
        ):  # Case 3.1 Check for ParameterTypes class
            if (
                isinstance(arg.annotation.value, ast.Name)
                and arg.annotation.value.id == "ParameterTypes"
            ):
                # ! This is node parameter
                # ParameterTypes class is used so it is a parameter
                # collect parameter informations
                hashmap["param"][arg.arg] = Parameter(
                    type=arg.annotation.attr.lower(),  # FE is using lowercase of these types
                    default_value=get_default_value(
                        defaults=defaults, args=args, index=i
                    ),
                ).to_dict()
        # Case 4. Generic type used
        elif isinstance(arg.annotation, ast.Subscript):
            # Case 4.1 Generic type is a class
            if (
                isinstance(arg.annotation.value, ast.Name)
                and arg.annotation.value.id == "Union"
            ):  # check if class is Union
                # ! Union class from typing is used
                if not isinstance(arg.annotation.slice, ast.Tuple):
                    continue
                elts = arg.annotation.slice.elts
                if any(not isinstance(expr, ast.Name) for expr in elts):
                    continue
                for cls in elts:
                    if not isinstance(cls, ast.Name):
                        continue
                    if cls.id not in ALL_DC_CLASSES:
                        raise ValueError(
                            "All values in Union type must be DataContainer class or subclass of DataContainer!"
                            + f"{cls.id} is found for parameter: '{arg.arg}'",
                        )
                input_type = "|".join([cls.id for cls in elts])
                hashmap["input"][arg.arg] = InputOutput(
                    name=arg.arg, type=input_type
                ).to_dict()
            # Case 4.2 Generit type is an attribute of a class
            elif isinstance(arg.annotation.value, ast.Attribute):
                # Case 4.2.1 Class is the ParameterTypes
                if (
                    isinstance(arg.annotation.value.value, ast.Name)
                    and arg.annotation.value.value.id == "ParameterTypes"
                ):
                    # ! This is node parameter
                    # An attribute of ParameterTypes is used so it is a parameter
                    # Currently Generic type is possible for only one type: SELECT
                    # so get options for SELECT type parameter
                    if isinstance(arg.annotation.slice, ast.Tuple):
                        elts = arg.annotation.slice.elts
                        options = [
                            option.value
                            for option in elts
                            if isinstance(option, ast.Constant)
                        ]
                    elif isinstance(arg.annotation.slice, ast.Constant):
                        options = [arg.annotation.slice.value]
                    else:
                        options = []
                    hashmap["param"][arg.arg] = Parameter(
                        type=arg.annotation.value.attr.lower(),  # FE is using lowercase of these types
                        default_value=get_default_value(
                            defaults=defaults, args=args, index=i
                        ),
                        options=options,
                    ).to_dict()
            else:
                continue
        else:
            continue

    has_return: ast.Return | None = flojoy_node.returns
    if has_return:
        if isinstance(has_return, ast.Name):
            if has_return.id not in ALL_DC_CLASSES:
                raise ValueError(
                    "Flojoy nodes must return DataConatainer class or subclass of DataContainer! "
                    + f"{has_return.id} is found"
                )
            hashmap["output"]["default"] = InputOutput(
                name="default", type=has_return.id
            ).to_dict()

    return hashmap


if __name__ == "__main__":
    func = extract_function_from_file(
        "H:\\flojoy\\studio\\PYTHON\\nodes\\GENERATORS\\SIMULATIONS\\SINE\\SINE.py",
        "SINE",
    )
    print("haspam: ", json.dumps(get_parameters_hashmap(func), indent=3))
