In this example we use the `R_DATASET` node with the parameter DNase, the `DF_2_ORDEREDTRIPLE` node with parameters x=1, y=0, z=2 and we also set the parameters of the `DOUBLE_INDEFINITE_INTEGRAL` node to width=16 and height=11.

The random dataset DNase is a good set for this example since it's columns (as an OrderedTriple) have length 176 which is 16 times 11 and we can see in the table of this OrderedTriple that we have the same 16 x values used on each 11 different y values. Then we decide for the width to be 16 and the height to be 11 reshape the matrices.

Then the `DOUBLE_INDEFINITE_INTEGRAL` node will reshape the 3 columns in matrices and use them to output a matrix of the same dimension then the 3 reshape matrices. In this matrix we have computes in each cell the volume up to that given point.

We can observe it here in the `SURFACE3D` node that indeed the volume goes higher and higher as the x and y values increase which is as expected since in the initial table of values for x, y and z we could see that they are also increasing. We can also see it with the values of the `MATRIX_VIEW` node which are also increasing as they go further.