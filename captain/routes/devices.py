from fastapi import APIRouter
from captain.services.hardware import get_device_finder
from captain.types.devices import DeviceInfo

router = APIRouter(tags=["devices"])


@router.get("/devices")
async def get_devices(include_drivers: bool = False) -> dict[str, str] | DeviceInfo:
    device_finder = get_device_finder()
    return DeviceInfo(
        cameras=device_finder.get_cameras(),
        serialDevices=device_finder.get_serial_devices(),
        visaDevices=device_finder.get_visa_devices(),
        nidaqmxDevices=device_finder.get_nidaqmx_devices() if include_drivers else [],
    )

