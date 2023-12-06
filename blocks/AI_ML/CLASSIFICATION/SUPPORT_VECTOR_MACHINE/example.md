In this example, the `SUPPORT_VECTOR_MACHINE` is passed the [iris dataset](https://archive.ics.uci.edu/dataset/53/iris), split into two parts. The training data contains 120 labels examples, while the input dataset contains 30 samples with the labels removed.

This data is read from disk with two `READ_CSV` nodes, and the output predictions made by the classifier are visualised in a `TABLE`.
