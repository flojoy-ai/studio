In this example, `LINSPACE` is used to generate a list of 1000 samples, it is then passed into two `POPULATE` nodes, which randomizes the values within the list with a normal (or Gaussian) distribution and a Poisson distribution.

The distribution is then plotted with `HISTOGRAM` and as expected of a Gaussian distribution,
the output of the `HISTOGRAM` node converges towards a bell curve. The Poisson distribution results in more of a step function.

The `POPULATE` node requires an input `Vector` or `OrderedPair` to function.
