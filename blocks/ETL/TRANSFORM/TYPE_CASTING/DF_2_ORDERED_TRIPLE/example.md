In this example, we use the `R_DATASET` and `DF_2_ORDERED_TRIPLE` nodes. The parameters that are used for these nodes, are the following:

`R_DATASET` : airquality

`DF_2_ORDERED_TRIPLE` : x=5, y=4, z=3

Here the `airquality` dataset has 6 columns in total. Using these parameters will generate an OrderedTriple with the columns x, y, and z, which corresponds to how the parameters were set.

We can see the node effect by observing the difference between the two `TABLE` nodes. In the table showing the OrderedTriple output, columns x and y are shown instead of their previous names, and the column values are different from the previous table, as expected since we select different columns.
Then, when comparing the `SCATTER3D` nodes, we can see that the graphs are different than expected. The first one shows the graph of the 3 first columns, while the one showing the resulting OrderedTriple, uses the 3 last columns.