import pytest
import requests.exceptions

from flojoy import Image, DataFrame, Grayscale

FLOJOY_LOCAL_FILE_SYSTEM_ASSETS_URL = "https://raw.githubusercontent.com/flojoy-ai/nodes/22908c9fbee6b923b10d36091be31c05c9b74e03/LOADERS/LOCAL_FILE_SYSTEM/LOCAL_FILE/assets"  # noqa: E501


@pytest.mark.parametrize(
    "file_type, output_type, file_url",
    [
        ("Image", Image, f"{FLOJOY_LOCAL_FILE_SYSTEM_ASSETS_URL}/astronaut.png"),
        ("Grayscale", Grayscale, f"{FLOJOY_LOCAL_FILE_SYSTEM_ASSETS_URL}/camera.png"),
        ("CSV", DataFrame, f"{FLOJOY_LOCAL_FILE_SYSTEM_ASSETS_URL}/iris_test.csv"),
        ("JSON", DataFrame, f"{FLOJOY_LOCAL_FILE_SYSTEM_ASSETS_URL}/employees.json"),
        ("XML", DataFrame, f"{FLOJOY_LOCAL_FILE_SYSTEM_ASSETS_URL}/menu.xml"),
    ],
)
def test_REMOTE_FILE_valid_usage(
    mock_flojoy_decorator, file_type, output_type, file_url
):
    import REMOTE_FILE

    output = REMOTE_FILE.REMOTE_FILE(file_url=file_url, file_type=file_type)
    assert isinstance(output, output_type)


@pytest.mark.parametrize(
    "file_url",
    [
        "not_valid",
        "/not/a/valid/url",
        "ftp://not_existing.url",
        "htp://misstyped.url",
    ],
)
def test_REMOTE_FILE_not_valid(file_url):
    import REMOTE_FILE

    with pytest.raises(ValueError):
        REMOTE_FILE.REMOTE_FILE(file_url=file_url, file_type="Image")


@pytest.mark.parametrize(
    "file_url", ["gcp://not_yet_supported", "s3://not_yet_supported"]
)
def test_REMOTE_FILE_not_yet_supported(file_url):
    import REMOTE_FILE

    error_msg = f"No connection adapters were found for '{file_url}'"
    with pytest.raises(requests.exceptions.InvalidSchema, match=error_msg):
        REMOTE_FILE.REMOTE_FILE(file_url=file_url, file_type="Image")
