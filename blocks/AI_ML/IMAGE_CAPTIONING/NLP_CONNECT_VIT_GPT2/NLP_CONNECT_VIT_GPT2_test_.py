import os
import pytest
import PIL.Image
import numpy as np
from flojoy import Image

try:
    import torch
except ImportError:
    torch = None


@pytest.fixture
def obama_image_array_rgb():
    _image_path = f"{os.path.dirname(os.path.realpath(__file__))}/assets/President_Barack_Obama.jpg"
    image = PIL.Image.open(_image_path).convert("RGB")
    return np.array(image)


@pytest.mark.slow
@pytest.mark.skipif(
    torch is None,
    reason="NLP_CONNECT_VIT_GPT2 requires torch to be installed | Ignore this test in CI",
)
def test_NLP_CONNECT_VIT_GPT2(
    mock_flojoy_decorator,
    mock_flojoy_venv_cache_directory,
    cleanup_flojoy_cache_fixture,
    obama_image_array_rgb,
):
    import NLP_CONNECT_VIT_GPT2

    input_img = Image(
        r=obama_image_array_rgb[:, :, 0],
        g=obama_image_array_rgb[:, :, 1],
        b=obama_image_array_rgb[:, :, 2],
        a=None,
    )
    output_df = NLP_CONNECT_VIT_GPT2.NLP_CONNECT_VIT_GPT2(input_img)  # type: ignore
    assert (
        output_df.m.iloc[0].caption
        == "a man in a suit and tie standing in front of a flag"
    )
