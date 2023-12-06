import pytest
from flojoy import Image, DataFrame, TextBlob
import numpy as np
from PIL import Image as PIL_Image
from os import path


@pytest.fixture
def astronaut_img_array_rgb():
    _image_path = f"{path.dirname(path.realpath(__file__))}/assets/astronaut.png"
    image = PIL_Image.open(_image_path).convert("RGB")
    return np.array(image)


@pytest.fixture
def camera_img_array_rgb():
    _image_path = f"{path.dirname(path.realpath(__file__))}/assets/camera.png"
    image = PIL_Image.open(_image_path).convert("RGB")
    return np.array(image)


@pytest.fixture
def iris_csv():
    return f"{path.dirname(path.realpath(__file__))}/assets/iris_test.csv"


@pytest.fixture
def menu_xml():
    return f"{path.dirname(path.realpath(__file__))}/assets/menu.xml"


@pytest.fixture
def employees_json():
    return f"{path.dirname(path.realpath(__file__))}/assets/employees.json"


@pytest.fixture
def insurance_excel():
    return f"{path.dirname(path.realpath(__file__))}/assets/sampledatainsurance.xlsx"


def test_LOCAL_FILE_img(
    mock_flojoy_decorator, astronaut_img_array_rgb, camera_img_array_rgb
):
    image_path = f"{path.dirname(path.realpath(__file__))}/assets/camera.png"

    expected_image = Image(
        r=camera_img_array_rgb[:, :, 0],
        g=camera_img_array_rgb[:, :, 1],
        b=camera_img_array_rgb[:, :, 2],
    )

    import LOCAL_FILE

    output = LOCAL_FILE.LOCAL_FILE(file_path=image_path, file_type="Image")

    assert isinstance(output, Image)
    np.testing.assert_array_equal(output.r, expected_image.r)
    np.testing.assert_array_equal(output.g, expected_image.g)
    np.testing.assert_array_equal(output.b, expected_image.b)
    np.testing.assert_array_equal(None, expected_image.a)

    output_from_textblob = LOCAL_FILE.LOCAL_FILE(
        default=TextBlob(text_blob=image_path), file_type="Image"
    )
    np.testing.assert_array_equal(output_from_textblob.r, expected_image.r)
    np.testing.assert_array_equal(output_from_textblob.g, expected_image.g)
    np.testing.assert_array_equal(output_from_textblob.b, expected_image.b)
    np.testing.assert_array_equal(None, expected_image.a)

    # The default image must be astronaut.png.
    default_image = Image(
        r=astronaut_img_array_rgb[:, :, 0],
        g=astronaut_img_array_rgb[:, :, 1],
        b=astronaut_img_array_rgb[:, :, 2],
    )

    default_output = LOCAL_FILE.LOCAL_FILE(file_type="Image")

    np.testing.assert_array_equal(default_output.r, default_image.r)
    np.testing.assert_array_equal(default_output.g, default_image.g)
    np.testing.assert_array_equal(default_output.b, default_image.b)
    np.testing.assert_array_equal(None, default_image.a)


def test_LOCAL_FILE_csv(mock_flojoy_decorator, iris_csv):
    import LOCAL_FILE

    output = LOCAL_FILE.LOCAL_FILE(file_path=iris_csv, file_type="CSV")
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

    output_from_textblob = LOCAL_FILE.LOCAL_FILE(
        default=TextBlob(text_blob=iris_csv), file_type="CSV"
    )
    assert output.m.equals(output_from_textblob.m)


# def test_LOCAL_FILE_xml(mock_flojoy_decorator, menu_xml):
#     import LOCAL_FILE

#     output = LOCAL_FILE.LOCAL_FILE(file_path=menu_xml, file_type="XML")
#     assert isinstance(output, DataFrame)
#     assert output.m.shape == (5, 4)
#     assert output.m.columns.to_list() == ["name", "price", "description", "calories"]
#     assert output.m["calories"].tolist() == [650, 900, 900, 600, 950]

#     output_from_textblob = LOCAL_FILE.LOCAL_FILE(
#         default=TextBlob(text_blob=menu_xml), file_type="XML"
#     )
#     assert output.m.equals(output_from_textblob.m)


def test_LOCAL_FILE_json(mock_flojoy_decorator, employees_json):
    import LOCAL_FILE

    output = LOCAL_FILE.LOCAL_FILE(file_path=employees_json, file_type="JSON")
    assert isinstance(output, DataFrame)
    assert output.m.shape == (10, 5)
    assert output.m.columns.to_list() == ["name", "age", "gender", "course", "gpa"]
    assert output.m["gpa"].tolist() == [
        3.7,
        3.9,
        3.5,
        3.8,
        3.6,
        3.4,
        3.2,
        3.9,
        3.1,
        3.7,
    ]

    output_from_textblob = LOCAL_FILE.LOCAL_FILE(
        default=TextBlob(text_blob=employees_json), file_type="JSON"
    )
    assert output.m.equals(output_from_textblob.m)


# def test_LOCAL_FILE_xlsx(mock_flojoy_decorator, insurance_excel):
#     import LOCAL_FILE

#     output = LOCAL_FILE.LOCAL_FILE(file_path=insurance_excel, file_type="Excel")
#     assert isinstance(output, DataFrame)
#     assert output.m.shape == (500, 10)
#     assert output.m.columns.to_list() == [
#         "Policy",
#         "Expiry",
#         "Location",
#         "State",
#         "Region",
#         "InsuredValue",
#         "Construction",
#         "BusinessType",
#         "Earthquake",
#         "Flood",
#     ]

#     output_from_textblob = LOCAL_FILE.LOCAL_FILE(
#         default=TextBlob(text_blob=insurance_excel), file_type="Excel"
#     )
#     assert output.m.equals(output_from_textblob.m)


# @pytest.mark.parametrize("file_type", ("CSV", "XML", "JSON", "Excel"))
# def test_LOCAL_FILE_no_file_path(mock_flojoy_decorator, file_type):
#     import LOCAL_FILE

#     expected_error_message_start = "The file path of the input file is missing"
#     with pytest.raises(ValueError, match=expected_error_message_start):
#         LOCAL_FILE.LOCAL_FILE(file_type=file_type)
