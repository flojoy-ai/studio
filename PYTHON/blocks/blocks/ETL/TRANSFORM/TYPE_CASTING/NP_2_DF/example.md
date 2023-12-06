In this example we use the `BASIC_OSCILLATOR` node to generate a numpy array.
The parameters of the node are set at:

sample_rate: 100
time: 10
waveform: sine
amplitude: 1
frequency: 1
offset: 0
phase: 0

With the left `TABLE` node we can see the x values representing the time when the value was taken and the y represent the values themselves. Then in the left `LINE` node we can see what the data looks like from time 0 to time 10.

Then we use the `NP_2_DF` node to convert the input data from the numpy array type to the dataframe type.

With the right `TABLE` node we can see that we now have only 1 column which is normal since with a dataframe type of data we only use the values since the time is represent by the number of the row at which the value is read in the column. We can observe this also in the right `LINE` node where we can see the same data but here instead of being from time 0 to time 10 it's from 0 to 1000. This is due to the fact that we have a `sample_rate` of 100 meaning that in 1 time measure we take 100 values. Therefore having 10 times means that we have 1000 rows for the y columns.
