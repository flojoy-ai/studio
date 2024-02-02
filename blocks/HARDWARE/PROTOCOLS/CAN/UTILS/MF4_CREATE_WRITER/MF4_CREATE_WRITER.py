from flojoy import (
    flojoy,
    Stateful,
    DeviceConnectionManager,
    DataContainer,
    HardwareDevice,
    Directory,
    File,
)
from typing import Optional, Literal
import can
import os


@flojoy(deps={"python-can": "4.3.1", "asammdf": "7.4.1"})
def MF4_CREATE_WRITER(
    dir: Directory,
    filename: str = "can_exported.mf4",
    database: Optional[File] = None,
    compression_level: Literal[
        "No compression",
        "Deflate (slower, but produces smaller files)",
        "Transposition + Deflate (slowest, but produces the smallest files)",
    ] = "No compression",
    default: Optional[DataContainer] = None
) -> Stateful:
    """Create a writer for the MF4 format.

    Logs CAN data to an ASAM Measurement Data File v4 (.mf4) as specified by the ASAM MDF standard (see https://www.asam.net/standards/detail/mdf/).

    MF4Writer does not support append mode.

    Parameters
    ----------
    dir : Directory
        The directory to export to.
    filename : str
        The name of the file to output.
    database : Optional[File]
        Path to a DBC or ARXML file that contains message description.
    compression_level : Literal
        The compression level to use. Defaults to "No compression".

    Returns
    -------
    Stateful
        A stateful object that can be used to write CAN data to the file.
    """

    if dir is None:
        raise ValueError("Please select a directory to export the data to")
    filename = f"{filename}.mf4" if filename[-4:] != ".mf4" else filename

    cpr_lvl = {
        "No compression": 0,
        "Deflate (slower, but produces smaller files)": 1,
        "Transposition + Deflate (slowest, but produces the smallest files)": 2,
    }[compression_level]

    writer = can.io.MF4Writer(
        os.path.join(dir.unwrap(), filename),
        database=database.unwrap() if database is not None else None,
        compression_level=cpr_lvl,
    )

    # Handle cleanup automatically
    DeviceConnectionManager.register_connection(
        HardwareDevice("MF4_writer"), writer, cleanup=lambda writer: writer.stop()
    )

    return Stateful(writer)
