from typing import Any, Union
from abc import ABC


class HardwareDevice(ABC):
    # Some unique identifier for the hardware device,
    # For cameras, this is either the port it's connected to or the camera index
    # For serial devices, this is the connection port
    # For visa devices, this is the visa address
    _id: str | int

    def __init__(self, id: int) -> None:
        self._id = id

    def get_id(self):
        return self._id


class HardwareConnection(ABC):
    _handle: Any

    def __init__(self, handle: Any) -> None:
        self._handle = handle

    def get_handle(self):
        return self._handle


class CameraDevice(HardwareDevice):
    pass


class SerialDevice(HardwareDevice):
    def get_port(self):
        return str(self.get_id())


class VisaDevice(HardwareDevice):
    def get_address(self):
        return str(self.get_id())


class NIDevice(HardwareDevice):
    pass


class CameraConnection(HardwareConnection):
    def __del__(self):
        self._handle.release()


class SerialConnection(HardwareConnection):
    def __del__(self):
        self._handle.close()


class VisaConnection(HardwareConnection):
    def __del__(self):
        self._handle.close()


class NIConnection(HardwareConnection):
    def __del__(self):
        self._handle.close()


class NodeReference:
    """Node parameter type"""

    ref: str

    def __init__(self, ref: str) -> None:
        self.ref = ref

    def unwrap(self):
        return self.ref


class Array:
    """Node parameter type of `list[str | float | int]`"""

    ref: list[str | float | int]

    def __init__(self, ref: list[str | float | int]) -> None:
        self.ref = ref

    def unwrap(self):
        return self.ref


class File:
    """Node parameter type of str"""
    ref: str

    def __init__(self, ref: str) -> None:
        self.ref = ref

    def unwrap(self):
        return self.ref


def format_param_value(value: Any, value_type: str):
    match value_type:
        case "Array":
            s = str(value)
            parsed_value = parse_array(s, [str, float, int], "list[int | float | str]")
            return Array(parsed_value)
        case "list[str]":
            return parse_array(str(value), [str], "list[str]")
        case "list[float]":
            return parse_array(str(value), [float], "list[float]")
        case "list[int]":
            return parse_array(str(value), [int], "list[int]")
        case "select" | "str":
            return str(value)

    if value == "":
        return None

    match value_type:
        case "float":
            return float(value)
        case "int":
            return int(value)
        case "bool":
            return bool(value)
        case "NodeReference":
            return NodeReference(str(value))
        case "CameraDevice" | "CameraConnection":
            return (
                CameraDevice(int(value)) if value.isnumeric() else CameraDevice(value)
            )
        case "SerialDevice" | "SerialConnection":
            return SerialDevice(value)
        case "VisaDevice" | "VisaConnection":
            return VisaDevice(value)
        case "File":
            return File(str(value))
        case _:
            print("hit default case", flush=True)
            return value


def parse_array(
    str_value: str, type_list: list[Any], param_type: str
) -> list[Union[int, float, str]]:
    if not str_value:
        return []

    val_list = [val.strip() for val in str_value.split(",")]
    # First try to cast into int, then float, then keep as string if all else fails
    for t in type_list:
        try:
            return list(map(t, val_list))
        except ValueError:
            continue

    raise ValueError(
        f"Couldn't parse list items with type {','.join([str(t) for t in type_list])}."
        + f"Value should be comma (',') separated {' | '.join([t.__name__ for t in type_list])} for parameter type {param_type}."
    )
