import pandas as pd


def test_TIMESERIES(mock_flojoy_decorator):
    import TIMESERIES

    start = pd.Timestamp("2023-01-01")
    end = pd.Timestamp("2023-07-20")
    timestamps = pd.Series(pd.date_range(start=start, end=end, freq="D"))
    res = TIMESERIES.TIMESERIES(start_date=start, end_date=end)

    assert timestamps.equals(res.m["Timestamp"])
