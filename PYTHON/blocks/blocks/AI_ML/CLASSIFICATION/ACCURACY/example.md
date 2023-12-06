In this example, the [iris dataset](https://archive.ics.uci.edu/dataset/53/iris) is split into two parts, one for training and the other for testing. The labels from the test data are stripped using an `EXTRACT_COLUMNS` node, taking only the features of the data. 

The true labels are also extracted with another `EXTRACT_COLUMNS` to be passed to the the `ACCURACY` node, along with the `SUPPORT_VECTOR_MACHINE` predictions.

In the output, we see that the `SUPPORT_VECTOR_MACHINE` has made correct predictions for all of the test data.
