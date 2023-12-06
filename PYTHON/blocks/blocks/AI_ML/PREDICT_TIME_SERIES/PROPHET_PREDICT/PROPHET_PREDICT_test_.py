import numpy as np
import pandas as pd
import pytest
from flojoy import DataFrame


def test_PROPHET_PREDICT(mock_flojoy_decorator, mock_flojoy_venv_cache_directory):
    pytest.importorskip(
        "fastparquet",
        reason="A suitable version of pyarrow or fastparquet is required for parquet support used by PROPHET_PREDICT.",
    )
    import PROPHET_PREDICT

    # Generate random time series data
    start_date = pd.Timestamp("2023-01-01")
    end_date = pd.Timestamp("2023-07-20")
    num_days = (end_date - start_date).days + 1
    timestamps = pd.date_range(start=start_date, end=end_date, freq="D")
    data = np.random.randn(num_days)  # Random data points

    df = pd.DataFrame({"Timestamp": timestamps, "Data": data})
    dc = DataFrame(df=df)

    # node under test
    res = PROPHET_PREDICT.PROPHET_PREDICT(default=dc, run_forecast=True, periods=365)

    # Should get back a dataframe
    assert isinstance(res.m, pd.DataFrame)
    # Should get back extra with the model is json form and the original df
    extra = res.extra
    assert extra["run_forecast"] is True
    assert isinstance(extra["original"], pd.DataFrame)
    # This should be identical to the original df, all columns, all rows
    assert (
        (extra["original"] == df.rename(columns={"Timestamp": "ds", "Data": "y"}))
        .all()
        .all()
    )
    assert extra["prophet"] is not None
    assert isinstance(extra["prophet"], str)
