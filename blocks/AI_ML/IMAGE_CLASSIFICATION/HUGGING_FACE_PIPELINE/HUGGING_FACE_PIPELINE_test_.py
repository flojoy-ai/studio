import os
import pytest

import numpy as np
import pandas as pd

from flojoy import Image, DataFrame
from PIL import Image as PIL_Image

try:
    import transformers
except ImportError:
    transformers = None


@pytest.fixture
def ada_lovelace_array_rgb():
    _image_path = os.path.join(
        os.path.dirname(os.path.realpath(__file__)),
        "assets",
        "ada_lovelace.png",
    )
    image = PIL_Image.open(_image_path).convert("RGB")
    return np.array(image, copy=True)


@pytest.mark.skipif(
    transformers is None,
    reason="HUGGING_FACE_PIPELINE requires transformers to be installed | Ignore this test in CI",
)
def test_HUGGING_FACE_PIPELINE_default(
    mock_flojoy_decorator,
    mock_flojoy_venv_cache_directory,
    cleanup_flojoy_cache_fixture,
    ada_lovelace_array_rgb,
):
    """HUGGING_FACE_PIPELINE functional test for the example application."""
    from HUGGING_FACE_PIPELINE import HUGGING_FACE_PIPELINE

    input_image = Image(
        r=ada_lovelace_array_rgb[:, :, 0],
        g=ada_lovelace_array_rgb[:, :, 1],
        b=ada_lovelace_array_rgb[:, :, 2],
        a=None,
    )

    df_classification_confidence_scores = HUGGING_FACE_PIPELINE(
        default=input_image,
        model="google/vit-base-patch16-224",
        revision="5dca96d",
    )

    assert isinstance(df_classification_confidence_scores, DataFrame)

    first_class_confidence_scores = df_classification_confidence_scores.m.iloc[0, :]

    assert first_class_confidence_scores["label"] == "overskirt"
    assert first_class_confidence_scores["score"] > 0.725


# Skip this test on Windows
@pytest.mark.skip(reason="The test does not complete on the CI.")
@pytest.mark.parametrize(
    "model, revision",
    (
        ("google/vit-base-patch16-224", "2ddc9d4"),
        ("microsoft/beit-base-patch16-224-pt22k-ft22k", "9da3011"),
        ("google/mobilenet_v1_0.75_192", "56dde11"),
    ),
)
@pytest.mark.slow
@pytest.mark.skipif(
    transformers is None,
    reason="HUGGING_FACE_PIPELINE requires transformers to be installed | Ignore this test in CI",
)
def test_HUGGING_FACE_PIPELINE_common_model_and_revisions(
    mock_flojoy_decorator,
    mock_flojoy_venv_cache_directory,
    cleanup_flojoy_cache_fixture,
    ada_lovelace_array_rgb,
    model,
    revision,
):
    """HUGGING_FACE_PIPELINE must work with a variety of models and revisions."""
    from HUGGING_FACE_PIPELINE import HUGGING_FACE_PIPELINE

    input_image = Image(
        r=ada_lovelace_array_rgb[:, :, 0],
        g=ada_lovelace_array_rgb[:, :, 1],
        b=ada_lovelace_array_rgb[:, :, 2],
        a=None,
    )

    df_classification_confidence_scores = HUGGING_FACE_PIPELINE(
        default=input_image,
        model=model,
        revision=revision,
    )

    assert isinstance(df_classification_confidence_scores, DataFrame)
    assert isinstance(df_classification_confidence_scores.m, pd.DataFrame)
