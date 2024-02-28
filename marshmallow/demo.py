from .flojoy.test_sequencer import export
import pandas as pd


def test_export_dataframe():
    df = pd.DataFrame({"a": [1, 2, 3], "b": [4, 5, 6]})

    export(df)

    assert True
