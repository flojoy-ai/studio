import numpy
from flojoy import Matrix, DataFrame, Vector
import pytest

try:
    import sklearn  # noqa: F401
except ImportError:
    sklearn_installed = False


@pytest.mark.skipif(
    not sklearn_installed, reason="sklearn is not installed | Skipping test in CI"
)
def test_COUNT_VECTORIZER(mock_flojoy_decorator):
    # create the CountVectorizerOutput container

    import COUNT_VECTORIZER

    element_a = Matrix(
        m=numpy.array(
            [
                "This is the first document.",
                "This document is the second document.",
                "And this is the third one.",
                "Is this the first document?",
            ]
        ),
    )

    # node under test
    res = COUNT_VECTORIZER.COUNT_VECTORIZER(default=element_a)  # type: ignore

    # check that the outputs look correct
    assert isinstance(res, dict)
    assert isinstance(res["tokens"], DataFrame)
    assert isinstance(res["word_count_vector"], Vector)
    assert set(res["tokens"].m.iloc[:, 0].tolist()) == {
        "and",
        "document",
        "first",
        "is",
        "one",
        "second",
        "the",
        "third",
        "this",
    }

    assert numpy.array_equal(
        res["word_count_vector"].v,
        numpy.array(
            [
                [0, 1, 1, 1, 0, 0, 1, 0, 1],
                [0, 2, 0, 1, 0, 1, 1, 0, 1],
                [1, 0, 0, 1, 1, 0, 1, 1, 1],
                [0, 1, 1, 1, 0, 0, 1, 0, 1],
            ]
        ),
    )
