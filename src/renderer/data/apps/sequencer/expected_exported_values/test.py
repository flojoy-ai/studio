from flojoy_cloud import test_sequencer
import pandas as pd


def test_min_max():
    value = 6.15
    # Always export as early as possible to avoid missing data
    test_sequencer.export(value)
    assert test_sequencer.is_in_range(value)


def test_min():
    value = 6.15
    
    test_sequencer.export(value)
    assert test_sequencer.is_in_range(value)


def test_max():
    value = 6.15
    test_sequencer.export(value)

    assert test_sequencer.is_in_range(value)
    # If multiple assert statements are defined and one of them fails:
    # - the rest of the assert statements will not be executed, and the result will be reported to the sequencer
    # - the sequencer will report the error, and the test will be marked as failed
    assert 0 < value


def test_export_dataframe():

    df = pd.DataFrame({'value': [6.15, 6.15, 6.15]})
    # Boolean and DataFrame values will be exported to the Cloud
    test_sequencer.export(df)

    assert df is not None


def test_export():
    value = 6.15
    # Always export as early as possible to avoid missing data
    test_sequencer.export(value)
    assert 12 < value   # <-- FAIL

    # Only the last executed export statement will be exported to the Cloud and reported to the sequencer
    test_sequencer.export(20)

    assert 0 < value
