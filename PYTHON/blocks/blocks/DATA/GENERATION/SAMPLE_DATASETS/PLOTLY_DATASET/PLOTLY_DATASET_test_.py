from plotly.express import data
from flojoy import DataFrame


# Tests that the function returns the expected DataFrame when called with the default dataset_key parameter
def test_default_dataset_key(mock_flojoy_decorator):
    import PLOTLY_DATASET

    result = PLOTLY_DATASET.PLOTLY_DATASET()
    assert isinstance(result, DataFrame)
    assert result.m.equals(data.wind())


# Tests that the function returns the expected DataFrame when called with the 'iris' dataset_key parameter
def test_iris_dataset_key(mock_flojoy_decorator):
    import PLOTLY_DATASET

    result = PLOTLY_DATASET.PLOTLY_DATASET(dataset_key="iris")
    assert isinstance(result, DataFrame)
    assert result.m.equals(data.iris())
