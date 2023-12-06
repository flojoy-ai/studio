In this example, the `LOOP` node is used to iterate over an app multiple times, specifically 5 times.

Inside the `LOOP` body, we start by multiplying two `CONSTANT` nodes, 4 and 2, together. For subsequent iterations, we utilize a special node called `FEEDBACK`. This node captures the result of multiplication of the two constants from the previous iteration and multiplies it to a `CONSTANT` node with a value of 2.

To visualize the sum, we employ the `BIG_NUMBER` node, which generates a plotly figure displaying a large number. The figure includes a relative delta, which represents the change relative to the previous iteration.