import ast

from .build_ast import (
    get_pip_dependencies,
    get_node_type,
    make_manifest_ast,
)
import inspect
from inspect import Parameter
from docstring_parser.numpydoc import NumpydocParser, ParamSection
from types import UnionType, NoneType, ModuleType
from typing import (
    Any,
    Callable,
    Type,
    Optional,
    Union,
    get_args,
    get_origin,
    is_typeddict,
    Literal,
)

from flojoy import DataContainer, DefaultParams, NodeReference, Array, NodeInitContainer

ALLOWED_PARAM_TYPES = [
    int,
    float,
    str,
    bool,
    list[int],
    list[float],
    list[str],
]

SPECIAL_TYPES = [NodeReference, Array]

SPECIAL_NODES = ["LOOP", "CONDITIONAL"]


class ManifestBuilder:
    def __init__(self, docstring: str | None):
        self.manifest: dict[str, Any] = {}
        self.inputs: list[Any] = []
        self.parameters: dict[str, Any] = {}
        self.outputs: list[Any] = []
        self.overload: dict[str, Any] = {}

        doc_parser = NumpydocParser()
        doc_parser.add_section(ParamSection("Inputs", "inputs"))
        self.docstring = doc_parser.parse(docstring) if docstring else None
        self.param_descriptions = None
        self.return_descriptions = None
        if self.docstring is not None:
            self.param_descriptions = {
                p.arg_name: p.description for p in self.docstring.params
            }
            self.return_descriptions = {
                p.return_name: p.description for p in self.docstring.many_returns
            }

    def with_name(self, name: str):
        self.manifest["name"] = name
        return self

    def with_key(self, key: str):
        self.manifest["key"] = key
        return self

    def with_type(self, node_type: str):
        self.manifest["type"] = node_type
        return self

    def with_input(
        self,
        name: str,
        input_type: Type,
        multiple: bool = False,
    ):
        self.inputs.append(
            {
                "name": name,
                "id": name,
                "type": type_str(input_type),
                "multiple": multiple,
                "desc": self._get_param_desc(name),
            }
        )
        return self

    def with_param(self, name: str, param_type: Type, default: Any):
        self.parameters[name] = {
            "type": type_str(param_type),
            "default": default,
            "desc": self._get_param_desc(name),
        }
        return self

    def with_select(self, name: str, options: list[Any], default: Any):
        self.parameters[name] = {
            "type": "select",
            "options": options,
            "default": default,
            "desc": self._get_param_desc(name),
        }
        return self

    def with_overload(self, name: str, values: dict[str, list[Any]], common: list[Any]):
        self.overload["common"] = common
        self.overload[name] = values
        return self

    def with_output(self, name: str, output_type: Type[Any], named: bool = False):
        self.outputs.append(
            {
                "name": name,
                "id": name,
                "type": type_str(output_type),
                "desc": self._get_return_desc(name, named=named),
            }
        )
        return self

    def build(self):
        if self.inputs:
            self.manifest["inputs"] = self.inputs
        if self.parameters:
            self.manifest["parameters"] = self.parameters
        if self.outputs:
            self.manifest["outputs"] = self.outputs
        if self.overload:
            self.manifest["overload"] = self.overload

        return self.manifest

    def _get_param_desc(self, param: str) -> Optional[str]:
        if self.param_descriptions:
            return self.param_descriptions.get(param)
        return None

    def _get_return_desc(self, param: str, named: bool) -> Optional[str]:
        # If the return type is not named, then the return_name would just be None
        # So just get the single return description out of the return value
        if not named and self.docstring and self.docstring.returns:
            return self.docstring.returns.description

        if self.return_descriptions:
            return self.return_descriptions.get(param)

        return None


def create_manifest(path: str) -> dict[str, Any]:
    node_name, tree = make_manifest_ast(path)
    code = compile(tree, filename="<unknown>", mode="exec")
    module = ModuleType("node_module")
    exec(code, module.__dict__)

    func = getattr(module, node_name)
    print(f"the function is: {func.__name__}")
    for node in tree.body:
        if isinstance(node, ast.FunctionDef) and len(node.decorator_list) == 1 and node.decorator_list[0].id == "display":
            print(f"the name is: {node.name}")

    manifest = make_manifest_for(func, node_name in SPECIAL_NODES)

    node_type = get_node_type(tree)
    if node_type:
        manifest["type"] = node_type

    pip_deps = get_pip_dependencies(tree)
    if pip_deps:
        manifest["pip_dependencies"] = pip_deps

    return manifest


def make_manifest_for(
    func: Callable[..., Any], is_special_node: bool = False,
) -> dict[str, Any]:
    mb = ManifestBuilder(func.__doc__).with_name(func.__name__).with_key(func.__name__)

    sig = inspect.signature(func)
    print(f"the signature is: {sig.parameters.items()}")
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
        for attr, value in dict(return_type.__annotations__).items():
            if is_special_node:
                mb.with_output(name=attr, output_type=value, named=True)
            else:
                if not issubclass(value, DataContainer):
                    raise TypeError(
                        "Return type must be a DataContainer or a typing.TypedDict"
                        f"consisting of only DataContainers as fields, got {return_type}"
                    )

                mb.with_output(attr, value, named=True)

    return mb.build()


def populate_inputs(
    name: str, param: Parameter, mb: ManifestBuilder, multiple: bool = False
) -> None:
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
                multiple=multiple,
            )
            return

        # Case 2.1: Union of DataContainers
        if len(dc_types) == len(union_types):
            # Obviously if the union contains DataContainer, it's just Any

            if DataContainer in dc_types:
                mb.with_input(name, Any, multiple=multiple)
            else:
                mb.with_input(name, param_type, multiple=multiple)
        # Case 2.2: Union of other types
        elif not dc_types:
            raise TypeError("Union types are not allowed for regular parameters")
            # Union for parameters is disabled for now

            # if not all([t in ALLOWED_PARAM_TYPES for t in union_types]):
            #     raise TypeError(
            #         f"Union types must be one of {ALLOWED_PARAM_TYPES},"
            #         f"got {union_types}"
            #     )
            # mb.with_param(name, param_type, default_value)
        else:
            raise TypeError("Type union must either contain all DataContainers")
    # Case 3: Any DataContainer
    elif param_type == DataContainer:
        mb.with_input(name, Any, multiple=multiple)
    elif is_special_type(param_type):
        default_value = None if default_value is None else default_value.unwrap()
        mb.with_param(name, param_type, default=default_value)
    # Case 4: Some class that inherits from DataContainer
    elif is_datacontainer(param_type):
        mb.with_input(name, param_type, multiple=multiple)
    # Case 5: Some kind of list
    elif is_outer_type(param_type, list):
        inner_type = param_type.__args__[0]
        # If it's a list of datacontainers we mark it as multiple
        # and recurse with the inner type
        if is_datacontainer(inner_type) or is_union_of_datacontainers(inner_type):
            populate_inputs(
                name,
                Parameter(
                    name, kind=param.kind, default=param.default, annotation=inner_type
                ),
                mb,
                multiple=True,
            )
            return
        if param_type not in ALLOWED_PARAM_TYPES:
            raise TypeError(
                f"Parameter types must be one of {ALLOWED_PARAM_TYPES} or special types like NodeReference,"
                f"got {param_type}"
            )
        mb.with_param(name, param_type, default_value)
    # Case 6: Literal type which becomes a select param
    elif is_outer_type(param_type, Literal):
        mb.with_select(name, list(param_type.__args__), default_value)
    # Case 7: Node init container, skip
    elif param_type == NodeInitContainer:
        return
    else:
        if param_type != DefaultParams and param_type not in ALLOWED_PARAM_TYPES:
            raise TypeError(
                f"Parameter types must be one of {ALLOWED_PARAM_TYPES} or special types like NodeReference,"
                f"got {param_type}"
            )
        if param_type != DefaultParams:
            mb.with_param(name, param_type, default_value)
            mb.with_overload(name, {type_str(param_type): ["testing"]}, ["test"])


def populate_overload(name: str, param: Parameter, mb: ManifestBuilder) -> None:
    match_value = param.default


def is_special_type(param_type: Any):
    return any(param_type == special_type for special_type in SPECIAL_TYPES)


def is_outer_type(t: Any, outer_type: Any):
    return hasattr(t, "__origin__") and t.__origin__ == outer_type


def is_union(t: Any):
    return is_outer_type(t, Union) or isinstance(t, UnionType)


def is_union_of_datacontainers(t):
    return is_union(t) and all([is_datacontainer(t) for t in get_union_types(t)])


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
