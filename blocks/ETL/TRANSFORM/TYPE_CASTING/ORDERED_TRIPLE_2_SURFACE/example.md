In this example we started with the `PLOTLY_DATASET` node to generate a DataFrame which we passed to a type casting node `DF_2_ORDERED_TRIPLE` to convert DataFrame into `OrderedTriple` type of `DataContainer` class. 

Then we used `ORDERED_TRIPLE_2_SURFACE` node to cast `OrderedTriple` to `Surface` `DataContainer` type. Finally we vizualized output with Plotly visualizer node `SURFACE3D`.