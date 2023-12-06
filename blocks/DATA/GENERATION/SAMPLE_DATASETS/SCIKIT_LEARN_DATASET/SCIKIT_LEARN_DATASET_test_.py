from flojoy import DataFrame
from sklearn.datasets import load_diabetes, load_iris


def test_load_iris(mock_flojoy_decorator):
    import SCIKIT_LEARN_DATASET

    result = SCIKIT_LEARN_DATASET.SCIKIT_LEARN_DATASET(dataset_name="iris")  # type: ignore
    assert isinstance(result, DataFrame)
    assert result.m.equals(load_iris(as_frame=True, return_X_y=True)[0])


def test_load_diabetes(mock_flojoy_decorator):
    import SCIKIT_LEARN_DATASET

    result = SCIKIT_LEARN_DATASET.SCIKIT_LEARN_DATASET(dataset_name="diabetes")  # type: ignore
    assert isinstance(result, DataFrame)
    assert result.m.equals(load_diabetes(as_frame=True, return_X_y=True)[0])
