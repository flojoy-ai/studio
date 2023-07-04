from .build_ast import (
    get_pip_dependencies,
    get_node_type,
    make_manifest_ast,
)
import inspect
from inspect import Parameter
from types import UnionType, NoneType, ModuleType
from typing import (
    Any,
    Callable,
    Type,
    Union,
    get_args,
    get_origin,
    is_typeddict,
    Literal,
)

from flojoy import DataContainer, DefaultParams, NodeReference, Array

ALLOWED_PARAM_TYPES = [
    int,
    float,
    str,
    bool,
    list[int],
    list[float],
    list[str],
]
SPECIAL_NODES = ["LOOP", "CONDITIONAL"]


class ManifestBuilder:
    def __init__(self):
        self.manifest: dict[str, Any] = {}
        self.inputs: list[Any] = []
        self.parameters: dict[str, Any] = {}
        self.outputs: list[Any] = []

    def with_name(self, name: str):
        self.manifest["name"] = name
        return self

    def with_key(self, key: str):
        self.manifest["key"] = key
        return self

    def with_type(self, node_type: str):
        self.manifest["type"] = node_type
        return self

    def with_input(self, name: str, input_type: str):
        self.inputs.append({"name": name, "id": name, "type": type_str(input_type)})
        return self

    def with_param(self, name: str, param_type: str, default: Any):
        self.parameters[name] = {"type": type_str(param_type), "default": default}
        return self

    def with_select(self, name: str, options: list[Any], default: Any):
        self.parameters[name] = {
            "type": "select",
            "options": options,
            "default": default,
        }
        return self

    def with_output(self, name: str, output_type: Type[Any]):
        self.outputs.append({"name": name, "id": name, "type": type_str(output_type)})
        return self

    def build(self):
        if self.inputs:
            self.manifest["inputs"] = self.inputs
        if self.parameters:
            self.manifest["parameters"] = self.parameters
        if self.outputs:
            self.manifest["outputs"] = self.outputs

        return self.manifest


def create_manifest(path: str) -> dict[str, Any]:
    node_name, tree = make_manifest_ast(path)
    code = compile(tree, filename="<unknown>", mode="exec")
    module = ModuleType("node_module")
    exec(code, module.__dict__)

    func = getattr(module, node_name)

    manifest = make_manifest_for(func)

    node_type = get_node_type(tree)
    if node_type:
        manifest["type"] = node_type

    pip_deps = get_pip_dependencies(tree)
    if pip_deps:
        manifest["pip_dependencies"] = pip_deps

    return manifest


def make_manifest_for(
    func: Callable[..., Any], is_special_node: bool = False
) -> dict[str, Any]:
    mb = ManifestBuilder().with_name(func.__name__).with_key(func.__name__)

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
            mb.with_output("default", Any)
        else:
            mb.with_output("default", return_type)
    # Single untyped output
    elif return_type == DataContainer:
        mb.with_output("default", Any)
    # Single typed output
    elif issubclass(return_type, DataContainer):
        mb.with_output("default", return_type)
    # Multiple outputs
    elif is_typeddict(return_type):
        for attr, value in vars(return_type).items():
            if attr.startswith("_"):
                continue
            if is_special_node:
                mb.with_output(name=attr, output_type=value)
            else:
                if not issubclass(value, DataContainer):
                    raise TypeError(
                        "Return type must be a DataContainer or a typing.TyedDict"
                        f"consisting of only DataContainers as fields, got {return_type}"
                    )

                mb.with_output(attr, value)

    return mb.build()


def populate_inputs(name: str, param: Parameter, mb: ManifestBuilder) -> None:
    param_type = param.annotation
    default_value = param.default if param.default is not param.empty else None

    if is_union(param_type):
        union_types = [t for t in get_union_types(param_type) if t != NoneType]
        dc_types = [t for t in union_types if is_datacontainer(t)]

        # If the union only contains 1 type, that means it was an Optional
        # So we just recurse with the inner type.
        if len(union_types) == 1:
            inner_type = param_type.__args__[0]

            # Recurse with the inner type, treating it as if the optional wasn't there
            populate_inputs(
                name,
                Parameter(
                    name, kind=param.kind, default=param.default, annotation=inner_type
                ),
                mb,
            )
            return

        # Case 2.1: Union of DataContainers
        if len(dc_types) == len(union_types):
            # Obviously if the union contains DataContainer, it's just Any

            if DataContainer in dc_types:
                mb.with_input(name, Any)
            else:
                mb.with_input(name, param_type)
        # # Case 2.2: Union of other types
        else:
            raise TypeError(
                "Type union must either contain all DataContainers"
                "or no DataContainers at all."
            )
    # Case 3: Any DataContainer
    elif param_type == DataContainer:
        mb.with_input(name, Any)
    elif is_special_type(param_type):
        mb.with_param(name, param_type, default=param_type.default.ref)
    # Case 4: Some class that inherits from DataContainer
    elif is_datacontainer(param_type):
        mb.with_input(name, param_type)
    # Case 5: Literal type which becomes a select param
    elif is_outer_type(param_type, Literal):
        mb.with_select(name, param_type.__args__, default_value)
    else:
        if param_type != DefaultParams and param_type not in ALLOWED_PARAM_TYPES:
            raise TypeError(
                f"Parameter types must be one of {ALLOWED_PARAM_TYPES} or special types like NodeReference,"
                f"got {param_type}"
            )
        mb.with_param(name, param_type, default_value)


def is_special_type(param_type: Any):
    special_types = [NodeReference, Array]
    return any(param_type == special_type for special_type in special_types)


def is_outer_type(t: Any, outer_type: Any):
    return hasattr(t, "__origin__") and t.__origin__ == outer_type


def is_union(t: Any):
    return is_outer_type(t, Union) or isinstance(t, UnionType)


def is_optional(t: Any):
    return get_origin(t) is Union and type(None) in get_args(t)


def is_datacontainer(t: Any):
    return inspect.isclass(t) and issubclass(t, DataContainer)


def get_union_types(union: Any):
    types = get_args(union)
    return [t for t in types if t != NoneType]


def get_full_type_name(t: Any) -> str:
    if hasattr(t, "__origin__"):
        arg_names = ", ".join(get_full_type_name(arg) for arg in t.__args__)
        return f"{t.__origin__.__name__}[{arg_names}]"
    else:
        return t.__name__


def union_type_str(union: Any):
    return "|".join([get_full_type_name(t) for t in get_union_types(union)])


def type_str(t: Any):
    return union_type_str(t) if is_union(t) else get_full_type_name(t)
