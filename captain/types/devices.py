from pydantic import BaseModel


class DeviceInfo(BaseModel):
    cameras: list
    serial_devices: list
