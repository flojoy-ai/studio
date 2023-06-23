import inspect
from types import UnionType
from typing import Any, Callable, Literal, Union, get_args
from dataclasses import fields, is_dataclass
from flojoy_mock import DataContainer

ALLOWED_PARAM_TYPES = [int, float, str, bool, list[int], list[float], list[str]]


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

        # Case 1: Untyped DataContainer
        if param_type == DataContainer:
            create_input(name, "any")
        # Case 2: Typed DataContainer with a generic type
        elif is_outer_type(param_type, DataContainer):
            generic = param_type.__args__[0]

            input_type = (
                union_type_str(generic) if is_union(generic) else generic.__name__
            )

            create_input(name, input_type)
        # Case 3: Union type
        elif is_union(param_type):
            if not all([t in ALLOWED_PARAM_TYPES for t in param_type.__args__]):
                raise TypeError(
                    f"Union types must be one of {ALLOWED_PARAM_TYPES}, got {param_type.__args__}"
                )

            params[name] = {
                "type": union_type_str(param_type),
                "default": default_value,
            }
        # Case 4: Literal type which becomes a select param
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

    if inputs:
        manifest["inputs"] = inputs
    if params:
        manifest["parameters"] = params

    outputs = []
    create_output = lambda name, output_type: outputs.append(
        {"name": name, "id": name, "type": output_type}
    )

    # TODO: Refactor similar code
    return_type = sig.return_annotation

    # Single untyped output
    if return_type == DataContainer:
        create_output("default", "any")
    # Single typed output
    elif is_outer_type(return_type, DataContainer):
        generic = return_type.__args__[0]
        output_type = union_type_str(generic) if is_union(generic) else generic.__name__

        create_output("default", output_type)
    # Multiple outputs
    elif is_dataclass(return_type):
        for field in fields(return_type):
            if field.type != DataContainer and not is_outer_type(
                field.type, DataContainer
            ):
                raise TypeError(
                    f"Return type must be a DataContainer or a DataClass consisting of only DataContainers as fields, got {return_type}"
                )

            generic = field.type.__args__[0]
            output_type = (
                union_type_str(generic) if is_union(generic) else generic.__name__
            )

            create_output(field.name, output_type)
    else:
        raise TypeError(
            f"Return type must be a DataContainer or a DataClass consisting of only DataContainers as fields, got {return_type}"
        )

    manifest["outputs"] = outputs

    return {"COMMAND": [manifest]}


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
