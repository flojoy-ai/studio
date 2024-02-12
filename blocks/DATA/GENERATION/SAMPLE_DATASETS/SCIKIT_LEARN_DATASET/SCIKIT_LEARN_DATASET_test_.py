from flojoy import DataFrame
import pytest

sklear_imported = True
try:
    from sklearn.datasets import load_diabetes, load_iris
except ImportError:
    sklear_imported = None


@pytest.mark.skipif(
    sklear_imported is None,
    reason="LOAD_IRIS requires torch to be installed | Ignore this test in CI",
)
def test_load_iris(mock_flojoy_decorator):
    import SCIKIT_LEARN_DATASET

    result = SCIKIT_LEARN_DATASET.SCIKIT_LEARN_DATASET(dataset_name="iris")  # type: ignore
    assert isinstance(result, DataFrame)
    assert result.m.equals(load_iris(as_frame=True, return_X_y=True)[0])


@pytest.mark.skipif(
    sklear_imported is None,
    reason="LOAD_IRIS requires torch to be installed | Ignore this test in CI",
)
def test_load_diabetes(mock_flojoy_decorator):
    import SCIKIT_LEARN_DATASET

    result = SCIKIT_LEARN_DATASET.SCIKIT_LEARN_DATASET(dataset_name="diabetes")  # type: ignore
    assert isinstance(result, DataFrame)
    assert result.m.equals(load_diabetes(as_frame=True, return_X_y=True)[0])
