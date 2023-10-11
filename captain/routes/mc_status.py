"""USED TO CHECK MICROCONTROLLER STATUS"""

from typing import Literal
import serial.tools.list_ports
from fastapi import APIRouter
from captain.utils.logger import logger

router = APIRouter(tags=["mc_status"])

class MCRequirements:
    def __init__(self, status):
        self.status = status

@router.get("/mc_has_requirements", summary="checks if the microcontroller has the necessary requirements")
async def mc_has_requirements():
    import serial

    # Configuration parameters
    port = "/dev/ttyUSB0"  # Update with your port name (COMx for Windows)
    baudrate = 115200      # Update if you're using a different baud rate

    # Open the serial port
    ser = serial.Serial(port, baudrate)

    status = "FAIL"

    try:
        while True:
            if ser.in_waiting: # If there is data in the buffer
                status = ser.readline().decode('utf-8').strip()  
                break

    except Exception as e:  
        if isinstance(e, KeyboardInterrupt): # Exit the loop when Ctrl+C is pressed
            pass
        else: # Otherwise, log the error that occured
            logger.error(e)

    finally:
        ser.close()  

    if status != 'PASS' or status != 'FAIL': 
        raise Exception("Invalid status received from microcontroller")

    return MCRequirements(status)
