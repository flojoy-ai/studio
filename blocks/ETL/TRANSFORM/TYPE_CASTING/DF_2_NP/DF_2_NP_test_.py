from flojoy import DataFrame
import pandas as pd


def test_DF_2_NP(mock_flojoy_decorator):
    import DF_2_NP

    m = [[0, 9, 0], [1, 9, 2], [2.0, 9.0, 4.0], [3, 9, 8], [4, 9, 16]]
    df = pd.DataFrame(m, columns=["x", "y", "z"])

    result = DF_2_NP.DF_2_NP(DataFrame(df=df))

    # Check result good dtype
    assert result.m.dtype == object

    # Check first row correct values
    assert result.m[0][0] == 0
    assert result.m[0][1] == 9
    assert result.m[0][2] == 0

    # Check same length
    assert len(result.m) == 5
