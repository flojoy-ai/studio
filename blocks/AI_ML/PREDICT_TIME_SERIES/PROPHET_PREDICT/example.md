In this example, the `TIMESERIES` node generates random time series data

This dataframe is then passed to the `PROPHET_PREDICT` node, with the default parameters
of `run_forecast=True` and `periods=365`. This node trains a `Prophet` model and runs a prediction
forecast over a 365 period. 

It returns a DataContainer with the following
* `type`: `dataframe`
* `m`: The forecasted dataframe
* `extra`: 
  * `run_forecast`: `True` (because that's what was passed in)
  * `prophet`: The trained `Prophet` model
  * `original`: The dataframe passed into the node

Finally, this is passed to 2 nodes, `PROPHET_PLOT` and `PROPHET_COMPONENTS`, wherein
the forecast and the trend components are plotted in Plotly. Because a forecast was already run,
the `PROPHET_PLOT` and `PROPHET_COMPONENTS` nodes know to use the already predicted dataframe.
