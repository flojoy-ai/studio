This example shows a simple way to create a loop with Flojoy.
First, you'll need to place these three nodes:

- The [`LOOP`](https://github.com/flojoy-io/nodes/blob/main/LOGIC_GATES/LOOPS/LOOP/LOOP.py) node which will define the number of loops.

- The [`LOOP_INDEX`](https://github.com/flojoy-io/nodes/blob/main/LOGIC_GATES/) node tracks the loop index (the number of loops that has occured). The index starts at 1 in Flojoy.

- The [`BIG_NUMBER`](https://github.com/flojoy-io/nodes/blob/main/VISUALIZERS/PLOTLY/BIG_NUMBER/BIG_NUMBER.py) node which is connected to the "end" output of the [`LOOP`] node, which serve, to terminate the program.

Then click on [`LOOP`] and change the number of loops to 100 (the default is -1 which causes the loop to repeat indefinitely). Click on [`LOOP_INDEX`] and change the referred node to [`LOOP`].

You can then run the app and watch the loop index increase to 100 as the loop continues.
