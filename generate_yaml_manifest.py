from types import UnionType
from typing import Any, Callable, Literal, Union, get_args
from collections import OrderedDict
import yaml
import importlib.util
import os
import inspect
from typing import TypeVar, Generic

T = TypeVar("T")


class DataContainer(Generic[T]):
    pass


class OrderedPair:
    pass


class OrderedTriple:
    pass


class Matrix:
    pass


NODES_DIR = "PYTHON/nodes"
MANIFEST_DIR = "manifest"
ALLOWED_PARAM_TYPES = [int, float, str, bool, list[int], list[float], list[str]]


def get_nodes_files(root_dir: str) -> list[str]:
    result = []

    for root, _, files in os.walk(root_dir):
        if root == root_dir:
            continue

        node_files = filter(
            lambda file: file.endswith(".py") and file[:-3].isupper(), files
        )

        for file_name in node_files:
            file_path = os.path.join(root, file_name)
            result.append(file_path)

    return result


def get_node_function(path: str) -> Callable:
    module_name = path[:-3].replace(os.sep, ".")
    module = importlib.import_module(module_name)

    func_name = os.path.basename(path)[:-3]
    return getattr(module, func_name)


def is_outer_type(t, outer_type):
    return hasattr(t, "__origin__") and t.__origin__ == outer_type


def is_union(t):
    return is_outer_type(t, Union) or isinstance(t, UnionType)


def get_union_types(union):
    if hasattr(union, "__args__"):
        return union.__args__
    else:
        return get_args(union)


def get_full_type_name(t):
    if hasattr(t, "__origin__"):
        arg_names = ", ".join(get_full_type_name(arg) for arg in t.__args__)
        return f"{t.__origin__.__name__}[{arg_names}]"
    else:
        return t.__name__


def union_type_str(union):
    return "|".join([get_full_type_name(t) for t in get_union_types(union)])


def make_manifest_for(node_type: str, func: Callable) -> dict[str, Any]:
    manifest: dict[str, Any] = {
        "name": func.__name__,
        "key": func.__name__,
        "type": node_type,
    }
    inputs = []
    params = {}

    create_input = lambda name, input_type: inputs.append(
        {"name": name, "id": name, "type": input_type}
    )

    sig = inspect.signature(func)
    for name, param in sig.parameters.items():
        param_type = param.annotation
        default_value = None

        if param.default is not param.empty:
            default_value = param.default

        if param_type == DataContainer:
            create_input(name, "any")
        elif is_outer_type(param_type, DataContainer):
            generic = param_type.__args__[0]

            if is_union(generic):
                input_type = union_type_str(generic)
            else:
                input_type = generic.__name__

            create_input(name, input_type)
        elif is_union(param_type):
            if not all([t in ALLOWED_PARAM_TYPES for t in param_type.__args__]):
                raise TypeError(
                    f"Union types must be one of {ALLOWED_PARAM_TYPES}, got {param_type.__args__}"
                )

            params[name] = {
                "type": union_type_str(param_type),
                "default": default_value,
            }
        elif is_outer_type(param_type, Literal):
            params[name] = {
                "type": "select",
                "options": param_type.__args__,
                "default": default_value,
            }
        else:
            if param_type not in ALLOWED_PARAM_TYPES:
                raise TypeError(
                    f"Parameter types must be one of {ALLOWED_PARAM_TYPES}, got {param_type}"
                )

            params[name] = {
                "type": get_full_type_name(param_type),
                "default": default_value,
            }

        # # TODO: Handle generics
        # if param.annotation == DataContainer:
        #     inputs.append({"name": name, "id": name, "type": "target"})
        # else:
        #     # TODO: Generate default value
        #     params[name] = {"type": param.annotation.__name__}

    if inputs:
        manifest["inputs"] = inputs
    if params:
        manifest["parameters"] = params

    return {"COMMAND": [manifest]}


def FOO(
    a: DataContainer[OrderedPair | OrderedTriple | Matrix],
    b: DataContainer[Matrix],
    quux: str | int,
    asd: str | int | list[str] | list[int],
    baz: Literal["a", "b", "c"] = "b",
    bar: float = 1.0,
):
    pass


def main():
    if not os.path.exists(MANIFEST_DIR):
        os.mkdir(MANIFEST_DIR)

    manifest = make_manifest_for("ARITHMETIC", FOO)
    print(manifest)
    with open(os.path.join(MANIFEST_DIR, "test.manifest.yaml"), "w") as f:
        yaml.safe_dump(manifest, f, sort_keys=False, indent=2)

    # for node_file in get_nodes_files(NODES_DIR):
    #     try:
    #         func = get_node_function(node_file)
    #     except ModuleNotFoundError:
    #         print(f"Failed to import {node_file}, probably missing dependencies")
    #         continue
    #
    #     # The folder before the node folder
    #     node_type = node_file[:-3].split(os.sep)[-2]
    #     manifest = make_manifest_for(node_type, func)


if __name__ == "__main__":
    main()
