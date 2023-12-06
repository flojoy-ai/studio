from flojoy import Matrix
import numpy as np


def test_MAT_2_DF(mock_flojoy_decorator):
    import MAT_2_DF

    mat = [[0, 1], [2, 3], [4, 5], [6, 7]]
    out = MAT_2_DF.MAT_2_DF(Matrix(m=mat))
    col1 = out.m.iloc[:, 0]
    col2 = out.m.iloc[:, 1]

    np.testing.assert_array_equal(([0, 2, 4, 6]), col1)
    np.testing.assert_array_equal(([1, 3, 5, 7]), col2)
    assert out.m.shape == (4, 2)
