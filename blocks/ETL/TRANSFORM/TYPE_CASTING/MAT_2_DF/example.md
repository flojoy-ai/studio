In this example we use the `MATRIX` node to generate a matrix with 9 rows and 3 columns in the parameters.

With the left `LINE` node we can see the matrix representation in which each of the 9 colored lines represent one of the row of the matrix and it's value at each column.

Then we use the `MAT_2_DF` node to convert the input array from matrix type to a dataframe type.

With the right `LINE` node we can see the output array of `MAT_2_DF`. In this graph we can only see 3 lines of different colors since it's showing the evolution of the 3 columns as we go through their rows which is as expected from a dataframe type of data.