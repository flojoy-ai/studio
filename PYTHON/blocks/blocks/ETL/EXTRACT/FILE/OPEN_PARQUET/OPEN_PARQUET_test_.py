import os
import pytest


@pytest.mark.slow
def test_OPEN_PARQUET(mock_flojoy_decorator):
    import OPEN_PARQUET

    _file_path = (
        f"{os.path.dirname(os.path.realpath(__file__))}/assets/userdata1.parquet"
    )
    output = OPEN_PARQUET.OPEN_PARQUET(_file_path)

    assert output.m.shape == (1000, 13)
