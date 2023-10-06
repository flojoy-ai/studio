from threading import Lock

from flojoy.parameter_types import (
    HardwareConnection,
    HardwareDevice,
    CameraDevice,
    CameraConnection,
    SerialDevice,
    SerialConnection,
    VisaDevice,
    VisaConnection,
    NIDevice,
    NIConnection,
)
from typing import Any
from .config import logger

_connection_lock = Lock()


class DeviceConnectionManager:
    handles: dict[str | int, HardwareConnection] = {}

    @classmethod
    def register_connection(cls, device: HardwareDevice, connection: Any):
        with _connection_lock:
            id = device.get_id()
            if id in cls.handles:
                raise ValueError(f"Connection with id {id} already exists")

            match device:
                case CameraDevice():
                    cls.handles[id] = CameraConnection(connection)
                case SerialDevice():
                    cls.handles[id] = SerialConnection(connection)
                case VisaDevice():
                    cls.handles[id] = VisaConnection(connection)
                case NIDevice():
                    cls.handles[id] = NIConnection(connection)

    @classmethod
    def get_connection(cls, id: str | int) -> HardwareConnection:
        with _connection_lock:
            return cls.handles[id]

    @classmethod
    def clear(cls):
        with _connection_lock:
            cls.handles.clear()

        logger.debug(f"Connections closed: {cls.handles}")
