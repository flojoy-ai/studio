from flojoy import DataFrame, Array
import pytest


# Tests that the function loads the training set by default
@pytest.mark.xfail(
    strict=False,
    reason="Sporadic errors might be raised by scikit-learn. Fixed by scikit-learn#27251",
)
def test_load_training_set_by_default(mock_flojoy_decorator):
    from TEXT_DATASET import TEXT_DATASET

    result = TEXT_DATASET()
    assert isinstance(result, DataFrame)
    assert len(result.m) == 11314
    assert set(result.m.columns) == {"Text", "Label"}
    assert set(result.m["Label"].unique()) == set(
        [
            "comp.graphics",
            "comp.os.ms-windows.misc",
            "comp.sys.ibm.pc.hardware",
            "comp.sys.mac.hardware",
            "comp.windows.x",
            "misc.forsale",
            "rec.autos",
            "rec.motorcycles",
            "rec.sport.baseball",
            "rec.sport.hockey",
            "sci.crypt",
            "sci.electronics",
            "sci.med",
            "sci.space",
            "soc.religion.christian",
            "talk.politics.guns",
            "talk.politics.mideast",
            "talk.politics.misc",
            "talk.religion.misc",
            "alt.atheism",
        ]
    )


# Tests that the function loads specific categories
@pytest.mark.xfail(
    strict=False,
    reason="Sporadic errors might be raised by scikit-learn. Fixed by scikit-learn#27251",
)
def test_load_specific_categories(mock_flojoy_decorator):
    from TEXT_DATASET import TEXT_DATASET

    result = TEXT_DATASET(
        categories=Array(["comp.graphics", "comp.os.ms-windows.misc"])
    )
    assert isinstance(result, DataFrame)
    assert len(result.m) == 1175
    assert set(result.m.columns) == {"Text", "Label"}
    assert set(result.m["Label"].unique()) == set(
        ["comp.graphics", "comp.os.ms-windows.misc"]
    )


# Tests that an error is raised when a non-existent category is passed
@pytest.mark.xfail(
    strict=False,
    reason="Sporadic errors might be raised by scikit-learn. Fixed by scikit-learn#27251",
)
def test_non_existent_category(mock_flojoy_decorator):
    from TEXT_DATASET import TEXT_DATASET

    with pytest.raises(ValueError):
        TEXT_DATASET(categories=Array(["non_existent_category"]))
