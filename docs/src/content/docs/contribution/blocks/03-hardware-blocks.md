---
title: Hardware Blocks
description: A guide to creating Flojoy blocks that connect to hardware instruments.
slug: "contribution/blocks/hardware-blocks"
sidebar:
  order: 3
---

Blocks that connect to hardware in Flojoy follow a common pattern.

There must always be an "open" block, which creates and persists a hardware connection.
Other instrument blocks can then have the required hardware connection injected into the parameters for interfacing with the instrument.

## Creating the "Open" block

The "open" block always follows the same template, the following is a minimal example for serial devices:

```python
import serial
from typing import Optional
from flojoy import SerialDevice, flojoy, DataContainer
from flojoy.connection_manager import DeviceConnectionManager

@flojoy(deps={"pyserial": "3.5"})
def OPEN_SERIAL(device: SerialDevice, baudrate: int = 9600) -> String:
    ser = serial.Serial(
        port=device.get_port(),
        baudrate=baudrate,
    )

    DeviceConnectionManager.register_connection(device, ser)

    return None
```

The "open" blocks must take in a `device` parameter, which allow you to select from a list of connected devices in the block parameters. The connection is then created, and registered in the `DeviceConnectionManager` along with its device. This allows the connection to be tied to a specific device for usage later.

## Using the connection in blocks

A short example using a serial connection to read some data:

```python
from typing import Optional

import numpy as np
import serial
from flojoy import OrderedPair, SerialDevice, flojoy


@flojoy(deps={"pyserial": "3.5"}, inject_connection=True)
def SERIAL_SINGLE_MEASUREMENT(
    connection: SerialConnection,
    default: Optional[OrderedPair] = None,
) -> OrderedPair:
    ser = connection.get_handle()

    s = ""
    while not s:
        s = ser.readline().decode()

    reading = s[:-2].split(",")
    reading = np.array(reading)
    reading = reading.astype("float64")
    x = np.arange(0, reading.size)

    return OrderedPair(x=x, y=reading)
```

Once the connection is created by the open block, we can then use it in other blocks by taking in a `SerialConnection`. We do this by passing `inject_connection=True` to the `flojoy` decorator, so that it is automatically passed to the block at runtime. `get_handle` can then be called on the object to get the underlying connection object.

> The `SerialConnection` parameter **must** have exactly the name `connection`.

Note that `Connection` objects are different from the `Device` objects.

`Connection` objects represent an open hardware connection to a device, and are used in blocks that perform operations that use that connection.

`Device` objects represent information for a connected hardware device, and are only used in "open" blocks as discussed in the previous section.
