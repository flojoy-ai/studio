In this example, the `RAND` node generates random values following a normal (or Gaussian) distribution.

The distribution is then plotted with `HISTOGRAM` and as expected of a Gaussian distribution,
the output of the `HISTOGRAM` node converges towards a bell curve.

There's also a `RAND` node with the `size` parameter set to 1, in which case a single number would be generated, which is displayed by `BIG_NUMBER` in this example.
