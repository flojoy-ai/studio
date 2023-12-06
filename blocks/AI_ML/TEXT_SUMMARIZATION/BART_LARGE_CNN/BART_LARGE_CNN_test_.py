import os
import pytest

import pandas as pd

from flojoy import DataFrame


@pytest.fixture
def long_text():
    _file_path = f"{os.path.dirname(os.path.realpath(__file__))}/story.txt"
    with open(_file_path, "r") as f:
        text = f.read()
    return text


@pytest.mark.slow
def test_BART_LARGE_CNN(
    mock_flojoy_decorator,
    mock_flojoy_venv_cache_directory,
    cleanup_flojoy_cache_fixture,
    long_text,
):
    import BART_LARGE_CNN

    output = BART_LARGE_CNN.BART_LARGE_CNN(
        DataFrame(df=pd.DataFrame({"text": [long_text]}))
    )
    assert isinstance(output, DataFrame)
    assert output.m.shape == (1, 1)
    assert output.m.columns == ["summary_text"]
