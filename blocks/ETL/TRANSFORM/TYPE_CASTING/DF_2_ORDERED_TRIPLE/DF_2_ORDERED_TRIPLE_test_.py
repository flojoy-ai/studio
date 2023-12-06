from flojoy import DataFrame
import pandas as pd
import numpy as np


def test_DF_2_ORDERED_TRIPLE_column_errorMessage(mock_flojoy_decorator):
    import DF_2_ORDERED_TRIPLE

    df = pd.DataFrame({"x": [0, 1], "y": [4, 9]})

    np.testing.assert_raises_regex(
        AssertionError,
        "The DataFrame needs to have a shape greater than 2 in order to be converted to the OrderedTriple type, got: 2",
        DF_2_ORDERED_TRIPLE.DF_2_ORDERED_TRIPLE,
        DataFrame(df=df),
    )


def test_DF_2_ORDERED_TRIPLE_columns_switch_and_dtype(mock_flojoy_decorator):
    import DF_2_ORDERED_TRIPLE

    df = pd.DataFrame({"hello": [0, 1, 2], "-": [3, 4, 5], "world": [6, 7, 8]})
    out = DF_2_ORDERED_TRIPLE.DF_2_ORDERED_TRIPLE(DataFrame(df=df), 0, 2, 1)

    np.testing.assert_array_equal(([0, 1, 2]), out.x)
    np.testing.assert_array_equal(([6, 7, 8]), out.y)
    np.testing.assert_array_equal(([3, 4, 5]), out.z)
    assert out.x.dtype == object
    assert out.y.dtype == object
    assert out.z.dtype == object
