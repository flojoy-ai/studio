In this example, the `LINSPACE` node is making a linear function which generate two lists that are required inputs for `DIFFERENTIATE` node.

Then the `DIFFERENTIATE` node computes the derivative of the array, y with respect to x.

In the `LINE` node which take as input the output of the `LINSPACE` node we can see what the diagonal representing the original function. In the other `LINE` node we can see the output of the `DIFFERENTIATE` node which is a constant line as expected!
