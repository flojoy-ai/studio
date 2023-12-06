---
title: Waveform Generator Return Errors
description: The RETURN_ERRORS_33510B node returns error messages from the WFG.
keywords: [Python, Instrument Control, Keysight, Wavefunction Generator, Function Generator, Keysight 33500B]
---

In this example, we return errors that the Keysight 33510B has generated.

:::note
The 33510B nodes should also work with other 33XXX wavefunction generators. However, these are untested as of yet.
:::

We must first add the [`CONNECTION_33510B`](https://github.com/flojoy-ai/nodes/tree/develop/IO/INSTRUMENTS/FUNCTION_GENERATORS/KEYSIGHT/33XXX) node. This will create the connection to the instrument at the beginning of the app. To allow this we must set the `VISA address` for this (and all subsequent `33510B` nodes). If the address does not appear in the parameters you may have to press `REFRESH` in the `HARDWARE MANAGER` tab.

We add the [`RETURN_ERRORS_33510B`](https://github.com/flojoy-ai/nodes/tree/develop/IO/INSTRUMENTS/FUNCTION_GENERATORS/KEYSIGHT/33XXX) node as well as the [`TEXT_VIEW`](https://github.com/flojoy-ai/nodes/blob/develop/VISUALIZERS/DATA_STRUCTURE/TEXT_VIEW/TEXT_VIEW.py) node to view the summary of the error.

In this case `0 No error` is returned, but in the case of an actual error, the specific error will appear.
