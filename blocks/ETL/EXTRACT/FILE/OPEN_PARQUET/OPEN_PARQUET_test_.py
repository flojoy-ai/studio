import os
import pytest

try:
    import pyarrow
    import fastparquet
except ImportError:
    import_error = True


@pytest.mark.skipif(
    import_error, reason="OPEN_PARQUET requires pyarrow and fastparquet to be installed | Ignore this test in CI"
)
@pytest.mark.slow
def test_OPEN_PARQUET(mock_flojoy_decorator):
    import OPEN_PARQUET

    _file_path = (
        f"{os.path.dirname(os.path.realpath(__file__))}/assets/userdata1.parquet"
    )
    output = OPEN_PARQUET.OPEN_PARQUET(_file_path)

    assert output.m.shape == (1000, 13)
