import serial.tools.list_ports
from fastapi import APIRouter
from captain.utils.logger import logger

router = APIRouter(tags=["serial_ports"])


class SerialPortList:
    def __init__(self, ports):
        self.ports = ports


@router.get("/serial_ports", summary="get serial ports")
async def get_serial_ports():
    serial_ports = list(serial.tools.list_ports.comports())
    logger.debug(serial_ports)
    return SerialPortList(list(serial.tools.list_ports.comports()))
