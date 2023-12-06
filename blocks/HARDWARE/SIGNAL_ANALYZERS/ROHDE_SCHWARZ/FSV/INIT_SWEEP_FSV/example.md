In this example, the Rohde & Schwarz FSV Signal Analyzer is used to view the FM radio range (86-110 MHz).

First 4 FSV nodes were added: `CONNECTION_FSV`, `SWEEP_SETTINGS_FSV`, `INIT_SWEEP_FSV`, and `EXTRACT_SWEEP_FSV`. A `LINE` node was also added. The `VISA address` was set for the 4 instrument nodes. The range of the signal analyzer sweep was set with `SWEEP_SETTINGS_FSV` (`start` = 86, `stop` = 110 MHz).

The nodes were then connected as shown in the image, and the app was run.
