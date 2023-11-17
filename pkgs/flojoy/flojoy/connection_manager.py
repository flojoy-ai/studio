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
from tm_devices import DeviceManager
from typing import Any, Callable
from .config import logger

_connection_lock = Lock()


class DeviceConnectionManager:
    handles: dict[str | int, HardwareConnection] = {}
    tm = DeviceManager()

    @classmethod
    def register_connection(
        cls,
        device: HardwareDevice,
        connection: Any,
        cleanup: Callable[[Any], Any] | None = None,
    ):
        with _connection_lock:
            id = device.get_id()
            if id in cls.handles:
                raise ValueError(f"Connection with id {id} already exists")

            match device:
                case CameraDevice():
                    cls.handles[id] = CameraConnection(connection, cleanup=cleanup)
                case SerialDevice():
                    cls.handles[id] = SerialConnection(connection, cleanup=cleanup)
                case VisaDevice():
                    cls.handles[id] = VisaConnection(connection, cleanup=cleanup)
                case NIDevice():
                    cls.handles[id] = NIConnection(connection, cleanup=cleanup)

    @classmethod
    def get_connection(cls, id: str | int) -> HardwareConnection:
        with _connection_lock:
            return cls.handles[id]

    @classmethod
    def clear(cls):
        with _connection_lock:
            logger.info(f"Connections closed: {cls.handles}")
            cls.handles.clear()

        cls.tm.cleanup_all_devices()
        cls.tm.remove_all_devices()
        logger.info("Cleaned up tm_devices DeviceManager")
