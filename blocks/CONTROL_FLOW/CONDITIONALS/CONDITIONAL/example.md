In this example, we begin with two `CONSTANT` nodes initialized with values 8 and 4. These nodes are connected to the X and Y inputs of the `CONDITIONAL` node, allowing us to compare them.

Based on the result of the comparison, the corresponding output gate of the  `CONDITIONAL` node will be activated. In this case, we have set the `operator_type` parameter to `>`, indicating that the comparison being performed is greater than. 

As a result, the `true` output gate of the `CONDITIONAL` node will be triggered, leading to the execution of the Plotly Visual `LINE` node connected to it.