from pydantic import BaseModel


class CameraDevice(BaseModel):
    name: str
    # either the index or the port (e.g /dev/video0)
    id: str | int


class DeviceInfo(BaseModel):
    cameras: list[CameraDevice]
    serialDevices: list
