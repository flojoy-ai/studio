import ast, re
from typing import Any, Callable, Optional
import os
from .build_ast import (
    get_pip_dependencies,
    make_manifest_ast,
)
from typing import Any
from flojoy import DataContainer


def to_pascal_case(variable_name: str):
    words = re.split(r"[_\s]|(?=[A-Z])", variable_name)
    pascal_case = "".join(word.capitalize() for word in words)
    return pascal_case


ALL_DC_CLASSES = [
    to_pascal_case(dc_type) for dc_type in DataContainer.allowed_types
] + ["DataContainer"]

SPECIAL_NODES = ["LOOP", "CONDITIONAL"]


class NodeManifestGenerator:
    allowed_cls_types: list[str] = ALL_DC_CLASSES
    special_node: bool
    manifest: dict[str, Any]
    function_def: ast.FunctionDef | None
    flojoy_decorator: ast.Call | None
    output_class: ast.ClassDef | None
    node_name: str

    def __init__(
        self,
        tree: ast.Module,
        node_name: str,
        special_node: bool = False,
    ):
        self.tree = tree
        self.node_name = node_name
        self.__validate_module()
        self.special_node = special_node
        self.output_class = self.__find(
            self.tree.body,
            lambda node: isinstance(node, ast.ClassDef)
            and "output" in node.name.lower(),
        )
        self.manifest = dict()
        self.manifest["name"] = node_name
        self.manifest["key"] = node_name

    def __validate_module(self):
        self.function_def = self.__get_flojoy_node()
        if not self.__has_decorator(self.function_def, "flojoy"):
            raise ValueError(
                f"Flojoy nodes must wrapped with flojoy decorator! node: {self.node_name}"
            )

        self.flojoy_decorator = self.__find(
            self.function_def.decorator_list,
            lambda d: isinstance(d, ast.Call)
            and isinstance(d.func, ast.Name)
            and d.func.id == "flojoy",
        )

    def __has_decorator(
        self, node: ast.FunctionDef | ast.ClassDef, decorator_name: str
    ) -> bool:
        for decorator in node.decorator_list:
            if isinstance(decorator, ast.Name) and decorator.id == decorator_name:
                return True
            elif (
                isinstance(decorator, ast.Call)
                and isinstance(decorator.func, ast.Name)
                and decorator.func.id == decorator_name
            ):
                return True

        return False

    def __get_flojoy_node(self):
        for node in ast.walk(self.tree):
            if isinstance(node, ast.FunctionDef) and node.name == self.node_name:
                self.function_def = node
                break
        if self.function_def is None:
            raise ValueError(f"Function '{self.node_name}' not found in file")
        return self.function_def

    def __find(
        self, collection: list[Any], predicate: Callable[[Any], bool]
    ) -> Optional[Any]:
        return next(filter(predicate, collection), None)

    def __get_parameter_dict(
        self, type: str, default_value: Any, options: list[str] | None = None
    ):
        param_dic = {"type": type, "default": default_value}
        if options:
            param_dic["options"] = options
        return param_dic

    def __get_parameter_default_value(
        self, defaults: list[ast.expr], args: list[ast.arg], index: int
    ) -> Any:
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
        elif isinstance(default_val, ast.List):
            d_v = ""
        elif isinstance(default_val, ast.UnaryOp) and isinstance(
            default_val.operand, ast.Constant
        ):
            d_v = default_val.operand.value * -1
        return d_v

    def __get_input_output_dict(self, name: str, type: str):
        return {"name": name, "id": name, "type": type}

    def __get_decorator_param(self, param_name: str):
        if not self.flojoy_decorator:
            return None
        return self.__find(
            self.flojoy_decorator.keywords, lambda k: k.arg == param_name
        )

    def __get_node_type_from_decorator(self):
        kw = self.__get_decorator_param("node_type")
        if not kw:
            return None
        if not isinstance(kw.value, ast.Constant):
            raise ValueError("Node type must be a string")
        return kw.value.value

    def __check_binop_and_return_type(
        self, binop: ast.BinOp, arg: ast.arg | None = None
    ) -> list[str]:
        input_type: list[str] = []
        err_text = "All values in Union type must be DataContainer class or subclass of DataContainer!"
        if not isinstance(binop.right, ast.Name) or not isinstance(
            binop.left, ast.Name
        ):
            return input_type
        if binop.right.id not in self.allowed_cls_types and not self.special_node:
            if arg:
                raise ValueError(
                    f"{err_text} {binop.right.id} is found for parameter: '{arg.arg}'",
                )
            else:
                raise ValueError(
                    f"{err_text} {binop.right.id} is found in one side",
                )

        input_type.append(binop.right.id)

        if isinstance(binop.left, ast.BinOp):
            left_type = self.__check_binop_and_return_type(binop.left, arg)
            input_type = input_type + left_type
            return input_type
        if binop.left.id not in self.allowed_cls_types and not self.special_node:
            if arg:
                raise ValueError(
                    f"{err_text} {binop.left.id} is found for parameter: '{arg.arg}'",
                )
            else:
                raise ValueError(
                    f"{err_text} {binop.left.id} is found in one side",
                )
        input_type.append(binop.left.id)

        return input_type

    def __get_output_from_class(self, node: ast.ClassDef, special_node: bool = False):
        outputs_map: dict[str, Any] = {}

        if any(
            isinstance(base, ast.Name) and base.id != "TypedDict" for base in node.bases
        ):
            raise TypeError(
                "Output class must be inherited from typing.TypedDict class"
            )
        assign_body: list[ast.AnnAssign] = [
            assign for assign in node.body if isinstance(assign, ast.AnnAssign)
        ]

        if assign_body:
            for body in assign_body:
                annotation = body.annotation
                if isinstance(annotation, ast.Name):
                    if annotation.id not in self.allowed_cls_types and not special_node:
                        raise ValueError(
                            "Flojoy nodes must return DataConatainer class or subclass of DataContainer! "
                            + f"{annotation.id} is found"
                        )
                    elif special_node:
                        outputs_map[body.target.id] = self.__get_input_output_dict(
                            name=body.target.id, type="Any"
                        )
                    else:
                        outputs_map[body.target.id] = self.__get_input_output_dict(
                            name=body.target.id, type=annotation.id
                        )
                elif isinstance(annotation, ast.BinOp):
                    output_type = self.__check_binop_and_return_type(annotation)
                    merged_type = "|".join(output_type)
                    outputs_map[body.target.id] = self.__get_input_output_dict(
                        name=body.target.id, type=merged_type
                    )
                elif isinstance(annotation, ast.Subscript):
                    # Case 4.1 Generic type is a class
                    if (
                        isinstance(annotation.value, ast.Name)
                        and annotation.value.id == "Union"
                    ):  # check if class is Union
                        # ! Union class from typing is used
                        if isinstance(annotation.slice, ast.Tuple):
                            elts = annotation.slice.elts
                            if any(isinstance(expr, ast.Name) for expr in elts):
                                for cls in elts:
                                    if (
                                        not isinstance(cls, ast.Name)
                                        or cls.id not in self.allowed_cls_types
                                    ):
                                        raise ValueError(
                                            "All values in Union type must be DataContainer class or subclass of DataContainer!"
                                            + f"{cls.id} is found in one side",
                                        )
                                output_type = "|".join([cls.id for cls in elts])
                                outputs_map[
                                    body.target.id
                                ] = self.__get_input_output_dict(
                                    name=body.target.id, type=output_type
                                )

        return outputs_map

    def __get_parameters_hashmap(self):
        outputs_map = None
        if self.output_class:
            outputs_map = self.__get_output_from_class(
                self.output_class, special_node=True
            )
        if not self.function_def:
            raise ValueError("No flojoy node found in file")
        args: list[ast.arg] = self.function_def.args.args
        defaults: list[ast.expr] = self.function_def.args.defaults
        hashmap: dict[str, dict[str, Any]] = {"input": {}, "param": {}, "output": {}}
        for i in range(len(args)):
            arg = args[i]
            # Case 1. Single type annotation  used
            if isinstance(
                arg.annotation, ast.Name
            ):  # single type annotation check if its DC type
                if arg.annotation.id in self.allowed_cls_types:
                    # ! This is an input
                    # this is an input parameter
                    hashmap["input"][arg.arg] = self.__get_input_output_dict(
                        name=arg.arg, type=arg.annotation.id
                    )
                elif arg.annotation.id == "DefaultParams":
                    continue
                else:
                    raise ValueError(
                        f"Unknown parameter added to node function: '{arg.arg}'"
                    )
            # Case 2. Union type separated by "|" used
            elif isinstance(
                arg.annotation, ast.BinOp
            ):  # check if all side have DC type
                input_type_list = self.__check_binop_and_return_type(
                    arg.annotation, arg
                )
                joined_type = "|".join(input_type_list)
                hashmap["input"][arg.arg] = self.__get_input_output_dict(
                    name=arg.arg, type=joined_type
                )
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
                    hashmap["param"][arg.arg] = self.__get_parameter_dict(
                        type=arg.annotation.attr.lower(),  # FE is using lowercase of these types
                        default_value=self.__get_parameter_default_value(
                            defaults=defaults, args=args, index=i
                        ),
                    )
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
                        if cls.id not in self.allowed_cls_types:
                            raise ValueError(
                                "All values in Union type must be DataContainer class or subclass of DataContainer!"
                                + f"{cls.id} is found for parameter: '{arg.arg}'",
                            )
                    input_type = "|".join([cls.id for cls in elts])
                    hashmap["input"][arg.arg] = self.__get_input_output_dict(
                        name=arg.arg, type=input_type
                    )
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
                            default_value=self.__get_parameter_default_value(
                                defaults=defaults, args=args, index=i
                            ),
                            options=options,
                        )
                else:
                    continue
            else:
                continue

        if outputs_map:
            hashmap["output"] = outputs_map
        else:
            has_return: ast.expr | None = self.function_def.returns
            if has_return:
                if isinstance(has_return, ast.Name):
                    if has_return.id not in self.allowed_cls_types:
                        raise ValueError(
                            "Flojoy nodes must return DataConatainer class or subclass of DataContainer! "
                            + f"{has_return.id} is found"
                        )
                    hashmap["output"]["default"] = self.__get_input_output_dict(
                        name="default", type=has_return.id
                    )
                elif isinstance(has_return, ast.BinOp):
                    output_type = self.__check_binop_and_return_type(has_return)
                    merged_type = "|".join(output_type)
                    hashmap["output"]["default"] = self.__get_input_output_dict(
                        name="default", type=merged_type
                    )
                elif isinstance(has_return, ast.Subscript):
                    # Case 4.1 Generic type is a class
                    if (
                        isinstance(has_return.value, ast.Name)
                        and has_return.value.id == "Union"
                    ):  # check if class is Union
                        # ! Union class from typing is used
                        if isinstance(has_return.slice, ast.Tuple):
                            elts = has_return.slice.elts
                            if any(isinstance(expr, ast.Name) for expr in elts):
                                for cls in elts:
                                    if (
                                        not isinstance(cls, ast.Name)
                                        or cls.id not in self.allowed_cls_types
                                    ):
                                        raise ValueError(
                                            "All values in Union type must be DataContainer class or subclass of DataContainer!"
                                            + f"{cls.id} is found in one side",
                                        )
                                output_type = "|".join([cls.id for cls in elts])
                                hashmap["output"][
                                    "default"
                                ] = self.__get_input_output_dict(
                                    name="default", type=output_type
                                )

        self.manifest["inputs"] = list(hashmap["input"].values())
        self.manifest["outputs"] = list(hashmap["output"].values())
        self.manifest["parameters"] = hashmap["param"]

    def get_manifest(self):
        self.__get_parameters_hashmap()
        if self.__get_node_type_from_decorator():
            self.manifest["type"] = self.__get_node_type_from_decorator()

        return self.manifest


def create_manifest(path: str) -> dict[str, Any]:
    node_name = os.path.basename(path)[:-3]
    tree = make_manifest_ast(path)
    manifest = NodeManifestGenerator(
        tree=tree, node_name=node_name, special_node=node_name in SPECIAL_NODES
    ).get_manifest()

    pip_deps = get_pip_dependencies(tree)
    if pip_deps:
        manifest["pip_dependencies"] = pip_deps

    return manifest
