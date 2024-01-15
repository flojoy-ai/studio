import nidaqmx
from typing import Literal


def get_devices():
    available_devices = nidaqmx.system.System().devices.device_names
    return available_devices


def get_devices_literal() -> Literal:
    available_devices = nidaqmx.system.System().devices.device_names
    return Literal(available_devices)
      
