import serial.tools.list_ports 
from fastapi import APIRouter

router = APIRouter(tags=["serial_ports"])

@router.get("/serial_ports", summary="get serial ports")
def get_serial_ports():
    return list(serial.tools.list_ports.comports())
