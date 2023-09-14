from fastapi import APIRouter
from captain.services.list_serial import get_cameras, get_serial_ports
from captain.types.devices import DeviceInfo

router = APIRouter(tags=["devices"])


@router.get("/devices")
async def get_devices():
    return DeviceInfo(cameras=get_cameras(), serial_devices=get_serial_ports())
