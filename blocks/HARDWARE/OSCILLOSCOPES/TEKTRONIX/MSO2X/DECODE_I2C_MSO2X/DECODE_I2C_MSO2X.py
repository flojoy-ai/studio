from typing import Optional, Literal
from flojoy import VisaConnection, flojoy, String, DataContainer
from time import sleep


@flojoy(inject_connection=True)
def DECODE_I2C_MSO2X(
    connection: VisaConnection,
    input: Optional[DataContainer] = None,
    bus_number: int = 1,
    clock_channel: Literal[
        "1",
        "2",
        "3",
        "4",
        "D0",
        "D1",
        "D2",
        "D3",
        "D4",
        "D5",
        "D6",
        "D7",
        "D8",
        "D9",
        "D10",
        "D10",
        "D12",
        "D13",
        "D14",
        "D15",
    ] = "1",
    data_channel: Literal[
        "1",
        "2",
        "3",
        "4",
        "D0",
        "D1",
        "D2",
        "D3",
        "D4",
        "D5",
        "D6",
        "D7",
        "D8",
        "D9",
        "D10",
        "D10",
        "D12",
        "D13",
        "D14",
        "D15",
    ] = "1",
    clock_threshold: float = 1,
    data_threshold: float = 1,
) -> String:
    """Creates a bus decode for decoding I2C.

    Requires a CONNECT_MSO2X block to create the connection.

    Tested on MSO24.

    Parameters
    ----------
    connection : VisaConnection
        The VISA address (requires the CONNECTION_MSO2X block).
    bus_number : int, default=1
        The bus number to use.
    clock_channel : select, default=1
        The clock channel to use.
    data_channel : select, default=1
        The data channel to use.
    clock_threshold : float, default=1
        The clock threshold voltage to use.
    data_threshold : float, default=1
        The data threshold voltage to use.

    Returns
    -------
    String
        I2C messages
    """

    # Retrieve oscilloscope instrument connection.
    scope = connection.get_handle()

    scope.write(f'BUS:ADDNEW "B{bus_number}"')
    scope.write(f"DISPLAY:WAVEVIEW1:BUS:B{bus_number}:STATE")

    if clock_channel[0] == "D":
        cchan = f"DCH1_{clock_channel}"
    else:
        cchan = f"CH{clock_channel}"
    if data_channel[0] == "D":
        dchan = f"DCH1_{data_channel}"
    else:
        dchan = f"CH{data_channel}"

    scope.write(f"BUS:B{bus_number}:I2C:CLOCK:SOUrce {cchan}")
    scope.write(f"BUS:B{bus_number}:I2C:DATa:SOUrce {dchan}")
    scope.write(f"BUS:B{bus_number}:I2C:CLOCK:THRESHOLD {clock_threshold}")
    scope.write(f"BUS:B{bus_number}:I2C:DATa:THRESHOLD {data_threshold}")
    scope.write('BUSTABLE:ADDNEW "Table1"')
    # Delay to let table fill on the scope.
    sleep(0.2)

    scope.write('SAVe:EVENTtable:BUS "c:/flojoy.csv"')
    # Delay to let the file save on the scope.
    sleep(0.3)

    data = scope.query_raw_binary('FILESystem:READFile "c:/flojoy.csv"')
    # Replace mu with u
    data = data.replace(b"\xb5s", b"us").decode().split(",")
    formatted = ""

    for i in range(5):
        # Find indexes with strings containing "Read" and "Write".
        write = next(
            (i for i, e in enumerate(data) if "Write" in e),
            len(data) - 1,
        )
        if write < len(data) - 1:
            formatted += f"{data[write]} {data[write+1]} "
            data[write] = " "

        read = next(
            (i for i, e in enumerate(data) if "Read" in e),
            len(data) - 1,
        )
        if read < len(data) - 1:
            formatted += f"{data[read]} {data[read+1]} "
            data[read] = " "

    return String(s=formatted)
