In this example we use the `R_DATASET` node to generate a dataframe with the airquality string in the parameter of the node.

With the left `LINE` node we see the input data where each line of a different color represent the evolution of a column as we go through its rows.

Then we use the `DF_2_NP` node to convert the input data from the dataframe type to the numpy array type.

With the right `LINE` node we can see the output data of `DF_2_NP`. In this graph we see a lot more of lines since each line is representing the evolution of each row as we go through its columns. We can also observe this by observing that the amount of different lines in the previous `LINE` node is 6 (so column 0 to 5), exacty like the axis we have here going from 0 to 5. This shows that our output data is a numpy array as expected.
