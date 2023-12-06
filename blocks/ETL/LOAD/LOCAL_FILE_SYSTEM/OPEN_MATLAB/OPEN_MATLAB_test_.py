import os
import pytest


@pytest.mark.slow
def test_OPEN_MATLAB(mock_flojoy_decorator):
    import OPEN_MATLAB

    _file_path = f"{os.path.dirname(os.path.realpath(__file__))}/assets/default.mat"
    output = OPEN_MATLAB.OPEN_MATLAB(_file_path)

    assert output.m.shape == (1831, 22)
