from flojoy import flojoy, File, Stateful, DeviceConnectionManager, HardwareDevice
from typing import Optional, Literal
import can


@flojoy()
def MF4_CREATE_WRITER(
    file: File,
    database: Optional[File],
    compression_level: Literal[
        "No compression",
        "Deflate (slower, but produces smaller files)",
        "Transposition + Deflate (slowest, but produces the smallest files)"
    ] = "No compression",
) -> Stateful:
    """Create a writer for the MF4 format.
    
    Logs CAN data to an ASAM Measurement Data File v4 (.mf4) as specified by the ASAM MDF standard (see https://www.asam.net/standards/detail/mdf/).

    MF4Writer does not support append mode.

    Parameters
    ----------
    file : File
        The file to write to.
    database : Optional[File]
        The database to use for decoding the CAN data.
    compression_level : Literal
        The compression level to use. Defaults to "No compression".

    Returns
    -------
    Stateful
        A stateful object that can be used to write CAN data to the file.
    """

    cpr_lvl = {
        "No compression": 0,
        "Deflate (slower, but produces smaller files)": 1,
        "Transposition + Deflate (slowest, but produces the smallest files)": 2,
    }[compression_level]

    writer = can.io.MF4Writer(
        file.unwrap(),
        database=database.unwrap() if database is not None else None,
        compression_level=cpr_lvl,
    )

    # Handle cleanup automatically
    DeviceConnectionManager.register_connection(
        HardwareDevice("MF4_writer"),
        writer,
        cleanup=lambda writer: writer.stop()
    )

    return Stateful(writer)
