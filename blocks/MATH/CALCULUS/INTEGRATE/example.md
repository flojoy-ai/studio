In this example, the `LINSPACE` node generate two lists (the `OrderedPair` composed of x and y) that are required for the `INTEGRATE` node.

Then `INTEGRATE` node computes its integration using trapezoidal rule on the given input lists.

With the two `LINE` nodes we can see that the original `LINSPACE` function is a diagonal of the form $y=x$ which is constantly increasing. Then the `LINE` node representing the integrate result is showing us an increasing curve as expected since the integral of $x$ is $\frac{x^2}{2}$.
