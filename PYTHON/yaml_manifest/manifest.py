import inspect
from types import UnionType
from typing import Any, Callable, Literal, Union, get_args
from dataclasses import fields, is_dataclass
from flojoy import DataContainer

ALLOWED_PARAM_TYPES = [int, float, str, bool, list[int], list[float], list[str]]


def make_manifest_for(node_type: str, func: Callable) -> dict[str, Any]:
    manifest: dict[str, Any] = {
        "name": func.__name__,
        "key": func.__name__,
        "type": node_type,
    }
    inputs = []
    params = {}

    def create_io(arr):
        def func(name: str, input_type: str):
            arr.append({"name": name, "id": name, "type": input_type})

        return func

    create_input = create_io(inputs)

    sig = inspect.signature(func)
    for name, param in sig.parameters.items():
        param_type = param.annotation
        default_value = param.default if param.default is not param.empty else None

        # Case 1: Union type
        if is_union(param_type):
            union_types = get_union_types(param_type)
            dc_types = [t for t in union_types if is_datacontainer(t)]

            # Case 1.1: Union of DataContainers
            if len(dc_types) == len(union_types):
                # Obviously if the union contains DataContainer, it's just Any
                if DataContainer in dc_types:
                    create_input(name, "any")
                else:
                    create_input(name, union_type_str(param_type))
            # Case 1.2: Union of other types
            elif not dc_types:
                if not all([t in ALLOWED_PARAM_TYPES for t in param_type.__args__]):
                    raise TypeError(
                        f"Union types must be one of {ALLOWED_PARAM_TYPES},"
                        f"got {param_type.__args__}"
                    )

                params[name] = {
                    "type": union_type_str(param_type),
                    "default": default_value,
                }
            else:
                raise TypeError(
                    "Type union must either contain all DataContainers"
                    "or no DataContainers at all."
                )
        # Case 2: Any DataContainer
        elif param_type == DataContainer:
            create_input(name, "any")
        # Case 3: Some class that inherits from DataContainer
        elif is_datacontainer(param_type):
            create_input(name, param_type.__name__)
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
                    f"Parameter types must be one of {ALLOWED_PARAM_TYPES},"
                    f"got {param_type}"
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

    create_output = create_io(outputs)

    # Do a similar thing for the return type
    return_type = sig.return_annotation

    # Union case
    if is_union(return_type):
        union_types = get_union_types(return_type)
        if not all(issubclass(t, DataContainer) for t in union_types):
            raise TypeError("Return type union must contain all DataContainers")

        # Obviously if the union contains DataContainer, it's just Any
        if DataContainer in union_types:
            create_output("default", "any")
        else:
            create_output("default", union_type_str(return_type))
    # Single untyped output
    elif return_type == DataContainer:
        create_output("default", "any")
    # Single typed output
    elif issubclass(return_type, DataContainer):
        create_output("default", return_type.__name__)
    # Multiple outputs
    elif is_dataclass(return_type):
        for field in fields(return_type):
            if not issubclass(field.type, DataContainer):
                raise TypeError(
                    "Return type must be a DataContainer or a DataClass"
                    "consisting of only DataContainers as fields, got {return_type}"
                )

            output_type = (
                union_type_str(field.type)
                if is_union(field.type)
                else field.type.__name__
            )

            create_output(field.name, output_type)
    else:
        raise TypeError(
            "Return type must be a DataContainer or a DataClass consisting"
            f"of only DataContainers as fields, got {return_type}"
        )

    manifest["outputs"] = outputs

    return {"COMMAND": [manifest]}


def is_outer_type(t, outer_type):
    return hasattr(t, "__origin__") and t.__origin__ == outer_type


def is_union(t):
    return is_outer_type(t, Union) or isinstance(t, UnionType)


def is_datacontainer(t):
    return inspect.isclass(t) and issubclass(t, DataContainer)


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
