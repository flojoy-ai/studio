from typing import Optional, Literal
from flojoy import VisaConnection, flojoy, DataContainer, String


@flojoy(inject_connection=True)
def I2C_TRIGGER_MSO2X(
    connection: VisaConnection,
    input: Optional[DataContainer] = None,
    bus_num: int = 1,
    condition: Literal[
        "start",
        "stop",
        "repeatstart",
        "ackmiss",
        "address",
        "data",
        "addranddata",
    ] = "start",
    addr_bits: Literal["7", "10"] = "10",
    addr: str = "0101010010",
    data_direction: Literal["read", "write", "nocare"] = "read",
    data_size: int = 1,
    data_value: str = "1100101",
) -> String:
    """Set the MSO2XX I2C trigger settings.

    Requires a CONNECT_MSO2X block to create the connection.

    Tested on MSO22 and MSO24.

    Parameters
    ----------
    connection : VisaConnection
        The VISA address (requires the CONNECTION_MSO2X block).
    bus_num : int, default=1
        Bus number to use as the trigger.
    condition : select, default=start
        What to trigger on
    addr_bits : select, default=10
        The number of bits in the address to trigger on
    addr : str, default=0101010010
        The address to trigger on (binary only currently). Can use X (0 or 1).
        Putting a lower number of bits: e.g. "1011" sets the address XXX1011.
    data_direction : select, default=read
        Trigger on read, write, or either data direction.
    data_size : int, default=1
        The data size, in bytes, to trigger on.
    data_value : str, default=11001101
        The data to trigger on (binary only currently).
        Can use X for wildcard (e.g. XXXXXXXX).

    Returns
    -------
    String
        Trigger settings
    """

    # Retrieve oscilloscope instrument connection
    scope = connection.get_handle()

    allowed = set("01Xx")

    assert set(addr) <= allowed, "addr must contain only 0, 1, or X"
    assert set(data_value) <= allowed, "addr must contain only 0, 1, or X"

    scope.write(f"TRIGger:A:BUS:B{bus_num}:I2C:CONDition {condition}")

    match condition:
        case "address":
            scope.write(f"TRIGger:A:BUS:B{bus_num}:I2C:ADDRess:MODe ADDR{addr_bits}")
            scope.write(f'TRIGger:A:BUS:B{bus_num}:I2C:ADDRess:VALue "{addr}"')
        case "data":
            scope.write(f"TRIGger:A:BUS:B{bus_num}:I2C:DIRection {data_direction}")
            scope.write(f"TRIGger:A:BUS:B{bus_num}:I2C:SIZe {data_size}")
            scope.write(f"TRIGger:A:BUS:B{bus_num}:I2C:VALue {data_value}")
        case "addranddata":
            scope.write(f"TRIGger:A:BUS:B{bus_num}:I2C:ADDRess:MODe ADDR{addr_bits}")
            scope.write(f"TRIGger:A:BUS:B{bus_num}:I2C:ADDRess:VALue {addr}")
            scope.write(f"TRIGger:A:BUS:B{bus_num}:I2C:DIRection {data_direction}")
            scope.write(f"TRIGger:A:BUS:B{bus_num}:I2C:SIZe {data_size}")
            scope.write(f"TRIGger:A:BUS:B{bus_num}:I2C:VALue {data_value}")

    return String(s="Trigger settings")
