In this example, we start by using the `LINSPACE` node to generate a `Vector` object of the `DataContainer` class.

Next, we employ the `PLOTLY_DATASET` node to create a `DataFrame` object of the `DataContainer` class.

To convert the `DataFrame` into an `OrderedTriple` object of the `DataContainer` class, we utilize the `DF_2_ORDEREDTRIPLE` node. The resulting `OrderedTriple` object contains three arrays: x, y, and z.

Finally, we visualize the data from these three nodes using the `TABLE` node, which generates a Plotly Table visualization for each of the input nodes.