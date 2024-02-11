from flojoy import flojoy, File, Stateful, DataContainer
from typing import Optional
import can


@flojoy()
def READ_LOG_FILE_CL2000(
    file_path: File,
    default: Optional[DataContainer] = None,
) -> Stateful:
    """Read the log file from the CSS Electronics CL2000 logger and return a list of can.Message

    This block reads a log file from the CSS Electronics CL2000 logger and returns a list of can.Message. The file is expected to follow the CL2000 documentation: https://canlogger.csselectronics.com/clx000-docs/cl2000/log/index.html#data-fields

    Parameters
    ----------
    file_path : File
        The file to read

    Returns
    -------
    Stateful
        List with all message with the can.Message format
    """

    # Utils
    # -----
    def process_timestamp(timestamp, configs, zero=None) -> float:
        format = int(
            configs["Time format"]
        )  # Format 0 to 6, kkk, sskkk, ... YYYYMMDDhhmmsskkk
        # YYYYMMDDhhmmss X kkk
        msSeparator = (
            configs["Time separator ms"] if configs["Time separator ms"] != "" else None
        )
        # YYYYMMDDhh X mm X sskkk
        timeSeparator = (
            configs["Time separator"] if configs["Time separator"] != "" else None
        )
        # YYYY X MM X DDhhmmsskkk
        dateSeparator = (
            configs["Date separator"] if configs["Date separator"] != "" else None
        )
        # YYYYMMDD X hhmmsskkk
        dateTimeSeparator = (
            configs["Time and date separator"]
            if configs["Time and date separator"] != ""
            else None
        )

        year, month, day, hour, min, sec, ms = 0, 0, 0, 0, 0, 0, 0

        if format == 6:
            if dateSeparator is not None:
                year = int(timestamp.split(dateSeparator)[0])
            else:
                year = int(timestamp[:4])
                timestamp = timestamp[4:]
        if format >= 5:
            if dateSeparator is not None:
                year = int(timestamp.split(dateSeparator)[1])
                timestamp = timestamp.split(dateSeparator)[2]
            else:
                month = int(timestamp[:2])
                timestamp = timestamp[2:]
        if format >= 4:
            if dateTimeSeparator is not None:
                day = int(timestamp.split(dateTimeSeparator)[0])
                timestamp = timestamp.split(dateTimeSeparator)[1]
            else:
                day = int(timestamp[:2])
                timestamp = timestamp[2:]
        if format >= 3:
            if timeSeparator is not None:
                hour = int(timestamp.split(timeSeparator)[0])
            else:
                hour = int(timestamp[:2])
                timestamp = timestamp[2:]
        if format >= 2:
            if timeSeparator is not None:
                min = int(timestamp.split(timeSeparator)[1])
                timestamp = timestamp.split(timeSeparator)[2]
            else:
                min = int(timestamp[:2])
                timestamp = timestamp[2:]
        if format >= 1:
            if msSeparator is not None:
                sec = int(timestamp.split(msSeparator)[0])
                ms = int(timestamp.split(msSeparator)[1])
            else:
                sec = int(timestamp[:2])
                timestamp = timestamp[2:]
                ms = int(timestamp)
        if format == 0:
            ms = int(timestamp)

        ref = 0 if zero is None else zero
        elapsed = (
            float(
                ms / 1000
                + sec
                + min * 60
                + hour * 3600
                + day * 86400
                + month * 2628000
                + year * 31536000
            )
            - ref
        )
        for_stability = round(elapsed, 3)
        return for_stability

    # Get the File
    # ------------
    with open(file_path.unwrap(), "r") as file:
        # Parse the header for the config
        # --------------------------------
        configs = {}
        line = file.readline()
        assert line, "The file is empty"
        while line.startswith("#"):
            line = line[2:]
            config, value = line.split(":")
            configs[config] = value.strip().replace('"', "")
            line = file.readline()
            assert line, "No message found in the file"

        # Read header to find data field position
        # ---------------------------------------
        header: list = line.replace("\n", "").split(configs["Value separator"])
        ts_idx = header.index("Timestamp") if "Timestamp" in header else None
        assert (
            ts_idx is not None
        ), "Timestamp field not found in file - required for CAN messages"
        type_idx = header.index("Type") if "Type" in header else None
        assert (
            type is not None
        ), "Type field not found in file - required for CAN messages"
        id_idx = header.index("ID") if "ID" in header else None
        assert (
            id_idx is not None
        ), "ID field not found in file - required for CAN messages"
        data_idx = (
            header.index("Data") if "Data" in header else None
        )  # Data is optional
        # Read all messages
        # -----------------
        messages = []
        zero = None

        while line := file.readline():
            message = line.split(configs["Value separator"])
            # python-can handle timestamp in seconds
            timestamp = process_timestamp(message[ts_idx], configs, zero)
            if zero is None:
                zero = timestamp
                timestamp = 0
            # Bytes are NOT left zero padded (always written using two characters) → fromhex expects it
            id_hex = message[id_idx] = (
                "0" + message[id_idx] if len(message[id_idx]) % 2 else message[id_idx]
            )
            arbritation_id = int.from_bytes(bytes.fromhex(id_hex))
            is_rx = True if int(message[type_idx]) in [0, 1] else False
            is_extended_id = True if int(message[type_idx]) in [1, 9] else False
            # Optional
            data = bytes.fromhex(message[data_idx]) if data_idx is not None else None
            message = can.Message(
                timestamp=timestamp,
                arbitration_id=arbritation_id,
                data=data,
                is_rx=is_rx,
                is_extended_id=is_extended_id,
                check=True,
            )
            messages.append(message)

        # Return
        # ------
        return Stateful(messages)
