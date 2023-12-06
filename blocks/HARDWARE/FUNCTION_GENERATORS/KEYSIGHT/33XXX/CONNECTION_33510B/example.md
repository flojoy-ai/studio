---
title: Waveform Generator Connection
description: The CONNECTIONS_33510B node is used to connect to a 33510B WFG.
keywords: [Python, Instrument Control, Keysight, Wavefunction Generator, Function Generator, Keysight 33500B]
---

In this example, we turn the wavefunction generation of a Keysight 33510B on.

:::note
The 33510B nodes should also work with other 33XXX wavefunction generators. However, these are untested as of yet.
:::

We must first add the [`CONNECTION_33510B`](https://github.com/flojoy-ai/nodes/tree/develop/IO/INSTRUMENTS/FUNCTION_GENERATORS/KEYSIGHT/33XXX) node. This will create the connection to the instrument at the beginning of the app. To allow this we must set the `VISA address` for this (and all subsequent `33510B` nodes). If the address does not appear in the parameters you may have to press `REFRESH` in the `HARDWARE MANAGER` tab.

We add two [`ON_OFF_33510B`](https://github.com/flojoy-ai/nodes/tree/develop/IO/INSTRUMENTS/FUNCTION_GENERATORS/KEYSIGHT/33XXX) nodes as well as the [`TEXT_VIEW`](https://github.com/flojoy-ai/nodes/blob/develop/VISUALIZERS/DATA_STRUCTURE/TEXT_VIEW/TEXT_VIEW.py) node to view the summary of the changes for each one. For the two `ON_OFF_33510B` we change the channel parameter (to `ch1` and `ch2`) to as well as changing `on_off`. The node simply turns the wavefunction generation on or off for the chosen channel. In this example we turn Channel 1 (`ch1`) off and Channel 2 (`ch2`) on.