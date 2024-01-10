from flojoy import flojoy, DataContainer, VisaDevice
from flojoy.connection_manager import DeviceConnectionManager
from typing import Optional
import pyvisa
import logging


@flojoy
def CONNECT_T3DSO1XXX(
    device: VisaDevice,
    default: Optional[DataContainer] = None,
) -> Optional[DataContainer]:
    """Connect to a Teledyne Lecroy T3DSO1000(A)-2000 oscilloscope.

    The connection is made with the VISA address in the Flojoy UI.

    This block should work with any Teledyne LeCroy T3DSO1000(A)-2000 series oscilloscope.

    Parameters
    ----------
    device: VisaDevice
        The VISA address to connect to.

    Returns
    -------
    DataContainer
        None.
    """

    device_addr = device.get_address()
    logging.info(f"Connecting to {device_addr} ...")
    rm = pyvisa.ResourceManager("@py")
    scope = rm.open_resource(device_addr)

    DeviceConnectionManager.register_connection(device, scope)

    scope_name = scope.query("*IDN?")
    logging.info(f"Connected to {scope_name}")

    if "lecroy" not in scope_name.lower():
        raise RuntimeError(
            f"The instrument you provided does not seem to be a LeCroy oscilloscope, its name is {scope_name}."
        )

    scope.write("COMM_HEADER OFF")
    scope.timeout = 20000

    return None
