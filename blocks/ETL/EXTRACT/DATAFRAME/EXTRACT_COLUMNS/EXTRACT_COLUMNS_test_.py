import pytest
import os
import numpy as np
import pandas as pd
from flojoy import DataFrame, Matrix, Array


@pytest.fixture
def student_csv():
    _file_path = f"{os.path.dirname(os.path.realpath(__file__))}/assets/student.csv"
    data = pd.read_csv(_file_path)
    return DataFrame(df=data)


@pytest.fixture
def example_matrix():
    m = np.array(
        [
            [3, 4, 6, 9, 11],
            [1, 12, 5, 6, 7],
            [8, 9, 11, 15, 7],
            [7, 5, 2, 5, 12],
            [2, 7, 10, 12, 16],
        ]
    )
    return Matrix(m=m)


def test_EXTRACT_COLUMNS_dataframe(mock_flojoy_decorator, student_csv):
    import EXTRACT_COLUMNS

    output = EXTRACT_COLUMNS.EXTRACT_COLUMNS(student_csv, Array(["name"]))
    assert isinstance(output, DataFrame)
    assert output.m.shape == (35, 1)
    assert output.m.columns == ["name"]
    assert output.m["name"].tolist() == [
        "John Deo",
        "Max Ruin",
        "Arnold",
        "Krish Star",
        "John Mike",
        "Alex John",
        "My John Rob",
        "Asruid",
        "Tes Qry",
        "Big John",
        "Ronald",
        "Recky",
        "Kty",
        "Bigy",
        "Tade Row",
        "Gimmy",
        "Tumyu",
        "Honny",
        "Tinny",
        "Jackly",
        "Babby John",
        "Reggid",
        "Herod",
        "Tiddy Now",
        "Giff Tow",
        "Crelea",
        "Big Nose",
        "Rojj Base",
        "Tess Played",
        "Reppy Red",
        "Marry Toeey",
        "Binn Rott",
        "Kenn Rein",
        "Gain Toe",
        "Rows Noump",
    ]


def test_EXTRACT_COLUMNS_matrix(mock_flojoy_decorator, example_matrix):
    import EXTRACT_COLUMNS

    output = EXTRACT_COLUMNS.EXTRACT_COLUMNS(example_matrix, Array([0, 1]))
    assert isinstance(output, Matrix)
    assert output.m.shape == (5, 2)
    assert np.array_equal(output.m, np.array([[3, 4], [1, 12], [8, 9], [7, 5], [2, 7]]))
