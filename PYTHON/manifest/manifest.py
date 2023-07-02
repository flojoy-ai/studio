from .build_ast import get_pip_dependencies, get_node_type, make_manifest_ast
import inspect
from inspect import Parameter
from types import UnionType, NoneType, ModuleType
from typing import Any, Callable, Literal, Optional, Type, Union, get_args
from dataclasses import fields, is_dataclass
from flojoy import DataContainer

ALLOWED_PARAM_TYPES = [
    int,
    float,
    str,
    bool,
    list[int],
    list[float],
    list[str],
    NoneType,
]


class ManifestBuilder:
    def __init__(self):
        self.manifest = {}
        self.inputs = []
        self.parameters = {}
        self.outputs = []

    def with_name(self, name: str):
        self.manifest["name"] = name
        return self

    def with_key(self, key: str):
        self.manifest["key"] = key
        return self

    def with_type(self, node_type: str):
        self.manifest["type"] = node_type
        return self

    def with_input(self, name: str, input_type: Type):
        self.inputs.append({"name": name, "id": name, "type": type_str(input_type)})
        return self

    def with_param(self, name: str, param_type: Type, default: Any):
        self.parameters[name] = {"type": type_str(param_type), "default": default}
        return self

    def with_select(self, name: str, options: list[Any], default: Any):
        self.parameters[name] = {
            "type": "select",
            "options": options,
            "default": default,
        }
        return self

    def with_output(self, name: str, output_type: Type):
        self.outputs.append({"name": name, "id": name, "type": type_str(output_type)})
        return self

    def build(self):
        if self.inputs:
            self.manifest["inputs"] = self.inputs
        if self.parameters:
            self.manifest["parameters"] = self.parameters
        if self.outputs:
            self.manifest["outputs"] = self.outputs

        return {"COMMAND": [self.manifest]}


def create_manifest(path: str) -> dict:
    node_name, tree = make_manifest_ast(path)
    code = compile(tree, filename="<unknown>", mode="exec")
    module = ModuleType("node_module")
    exec(code, module.__dict__)

    func = getattr(module, node_name)

    node_type = get_node_type(tree)
    if not node_type:
        node_type = "default"

    manifest = make_manifest_for(node_type, func)

    pip_deps = get_pip_dependencies(tree)
    if pip_deps:
        manifest["COMMAND"][0]["pip_dependencies"] = pip_deps

    return manifest


# TODO: Refactor to use builder pattern, should be cleaner


def make_manifest_for(node_type: str, func: Callable) -> dict[str, Any]:
    mb = (
        ManifestBuilder()
        .with_name(func.__name__)
        .with_key(func.__name__)
        .with_type(node_type)
    )

    sig = inspect.signature(func)
    for name, param in sig.parameters.items():
        populate_inputs(name, param, mb)

    # Do a similar thing for the return type
    return_type = sig.return_annotation

    # Union case
    if is_union(return_type):
        union_types = get_union_types(return_type)
        if not all(issubclass(t, DataContainer) for t in union_types):
            raise TypeError("Return type union must contain all DataContainers")

        # Obviously if the union contains DataContainer, it's just Any
        if DataContainer in union_types:
            mb = mb.with_output("default", Any)
        else:
            mb = mb.with_output("default", return_type)
    # Single untyped output
    elif return_type == DataContainer:
        mb = mb.with_output("default", Any)
    # Single typed output
    elif issubclass(return_type, DataContainer):
        mb = mb.with_output("default", return_type)
    # Multiple outputs
    elif is_dataclass(return_type):
        for field in fields(return_type):
            if not issubclass(field.type, DataContainer):
                raise TypeError(
                    "Return type must be a DataContainer or a Dataclass"
                    "consisting of only DataContainers as fields, got {return_type}"
                )

            mb = mb.with_output(field.name, field.type)
    else:
        # Terminators are special, they don't have outputs
        if not node_type == "TERMINATOR":
            raise TypeError(
                "Return type must be a DataContainer or a Dataclass consisting"
                f"of only DataContainers as fields, got {return_type}"
            )

    return mb.build()


def populate_inputs(name: str, param: Parameter, mb: ManifestBuilder) -> None:
    param_type = param.annotation
    default_value = param.default if param.default is not param.empty else None

    # Case 1: Union type
    if is_union(param_type):
        union_types = [t for t in get_union_types(param_type) if t != NoneType]
        dc_types = [t for t in union_types if is_datacontainer(t)]

        # Case 1.1: Union of DataContainers
        if len(dc_types) == len(union_types):
            # Obviously if the union contains DataContainer, it's just Any
            if DataContainer in dc_types:
                mb = mb.with_input(name, Any)
            else:
                mb = mb.with_input(name, param_type)
        # Case 1.2: Union of other types
        elif not dc_types:
            if not all([t in ALLOWED_PARAM_TYPES for t in union_types]):
                raise TypeError(
                    f"Union types must be one of {ALLOWED_PARAM_TYPES},"
                    f"got {union_types}"
                )
            mb = mb.with_param(name, param_type, default_value)
        else:
            raise TypeError(
                "Type union must either contain all DataContainers"
                "or no DataContainers at all."
            )
    # Case 2: Any DataContainer
    elif param_type == DataContainer:
        mb = mb.with_input(name, Any)
    # Case 3: Some class that inherits from DataContainer
    elif is_datacontainer(param_type):
        mb = mb.with_input(name, param_type)
    elif is_outer_type(param_type, Optional):
        inner_type = param_type.__args__[0]

        # Recurse with the inner type, treating it as if the optional wasn't there
        populate_inputs(
            name,
            Parameter(
                name, kind=param.kind, default=param.default, annotation=inner_type
            ),
            mb,
        )
    # Case 4: Literal type which becomes a select param
    elif is_outer_type(param_type, Literal):
        mb = mb.with_select(name, param_type.__args__, default_value)
    else:
        if param_type not in ALLOWED_PARAM_TYPES:
            raise TypeError(
                f"Parameter types must be one of {ALLOWED_PARAM_TYPES},"
                f"got {param_type}"
            )
        mb = mb.with_param(name, param_type, default_value)


def is_outer_type(t, outer_type):
    return hasattr(t, "__origin__") and t.__origin__ == outer_type


def is_union(t):
    return is_outer_type(t, Union) or isinstance(t, UnionType)


def is_datacontainer(t):
    return inspect.isclass(t) and issubclass(t, DataContainer)


def get_union_types(union):
    if hasattr(union, "__args__"):
        types = union.__args__
    else:
        types = get_args(union)
    return [t for t in types if t != NoneType]


def get_full_type_name(t):
    if hasattr(t, "__origin__"):
        arg_names = ", ".join(get_full_type_name(arg) for arg in t.__args__)
        return f"{t.__origin__.__name__}[{arg_names}]"
    else:
        return t.__name__


def union_type_str(union):
    return "|".join([get_full_type_name(t) for t in get_union_types(union)])


def type_str(t):
    return union_type_str(t) if is_union(t) else get_full_type_name(t)
