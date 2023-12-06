---
title: Waveform Generator Output Sync
description: The OUTPUT_SYNC_33510B node is used sync multiple outputs phases.
keywords: [Python, Instrument Control, Keysight, Wavefunction Generator, Function Generator, Keysight 33500B]
---

In this example, we sync the waveform output phases generation for a Keysight 33510B. Each channel in the 33510B has a `phase` which results in shifting the wavefunction in the x axis (i.e. time). One channel should be chosen as the baseline for this phase to ensure the phases match for the two channels (the phase of the second channel is then with respect to the baseline channel).

:::note
The 33510B nodes should also work with other 33XXX wavefunction generators. However, these are untested as of yet.
:::

We must first add the [`CONNECTION_33510B`](https://github.com/flojoy-ai/nodes/tree/develop/IO/INSTRUMENTS/FUNCTION_GENERATORS/KEYSIGHT/33XXX) node. This will create the connection to the instrument at the beginning of the app. To allow this we must set the `VISA address` for this (and all subsequent `33510B` nodes). If the address does not appear in the parameters you may have to press `REFRESH` in the `HARDWARE MANAGER` tab.

We add the [`OUTPUT_SYNC_33510B`](https://github.com/flojoy-ai/nodes/tree/develop/IO/INSTRUMENTS/FUNCTION_GENERATORS/KEYSIGHT/33XXX) node as well as the [`TEXT_VIEW`](https://github.com/flojoy-ai/nodes/blob/develop/VISUALIZERS/DATA_STRUCTURE/TEXT_VIEW/TEXT_VIEW.py) node to view the summary of the changes.

We then must set the node parameters. First, the VISA address must be set for all nodes as mentioned above. Then the reference channel must be set as well as whether to turn the output sync on or off. You can also use this node to query the current output sync settings on the instrument.
