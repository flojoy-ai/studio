import pytest
import os
from flojoy import DataFrame


@pytest.fixture
def iris_csv_file_path():
    return f"{os.path.dirname(os.path.realpath(__file__))}/assets/iris_test.csv"


def test_READ_CSV(mock_flojoy_decorator, iris_csv_file_path):
    import READ_CSV

    output = READ_CSV.READ_CSV(file_path=iris_csv_file_path)
    assert isinstance(output, DataFrame)
    assert output.m.shape == (30, 5)
    assert output.m.columns.to_list() == [
        "sepal_length",
        "sepal_width",
        "petal_length",
        "petal_width",
        "variety",
    ]
    assert output.m["variety"].tolist() == [
        "Versicolor",
        "Setosa",
        "Virginica",
        "Setosa",
        "Versicolor",
        "Virginica",
        "Virginica",
        "Setosa",
        "Setosa",
        "Setosa",
        "Virginica",
        "Versicolor",
        "Virginica",
        "Virginica",
        "Virginica",
        "Setosa",
        "Setosa",
        "Virginica",
        "Versicolor",
        "Versicolor",
        "Setosa",
        "Versicolor",
        "Versicolor",
        "Versicolor",
        "Setosa",
        "Virginica",
        "Setosa",
        "Versicolor",
        "Versicolor",
        "Virginica",
    ]
