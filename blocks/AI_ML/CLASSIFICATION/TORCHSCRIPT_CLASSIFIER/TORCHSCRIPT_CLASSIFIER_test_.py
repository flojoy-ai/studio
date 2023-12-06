import pytest
import os
import tempfile
import pandas as pd
import numpy as np
import PIL
from flojoy import run_in_venv, Image, DataFrame


@pytest.fixture
def torchscript_model_path():
    # Download and save a test model, this requires
    # torch which is why we need to run this in a venv.
    @run_in_venv(pip_dependencies=["torch~=2.0.1", "torchvision~=0.15.2"])
    def _download_test_model(path: str):
        import torch
        import torchvision

        class ModelWithTransform(torch.nn.Module):
            def __init__(self):
                super().__init__()
                self.model = torch.hub.load(
                    "pytorch/vision:v0.15.2",
                    "mobilenet_v3_small",
                    pretrained=True,
                    skip_validation=True,  # This will save us from github rate limiting, https://github.com/pytorch/vision/issues/4156#issuecomment-939680999
                )
                self.model.eval()
                self.transforms = (
                    torchvision.models.MobileNet_V3_Small_Weights.DEFAULT.transforms()
                )

            def forward(self, x):
                return self.model(self.transforms(x))

        model = ModelWithTransform()
        scripted = torch.jit.script(model)
        torch.jit.save(scripted, path)

    with tempfile.TemporaryDirectory() as tempdir:
        model_path = os.path.join(tempdir, "mbnet_v3_small.torchscript")
        _download_test_model(model_path)
        yield model_path


@pytest.fixture
def class_names():
    csv_path = os.path.join(
        os.path.dirname(os.path.realpath(__file__)), "assets", "class_names.csv"
    )
    return DataFrame(df=pd.read_csv(csv_path))


@pytest.fixture
def obama_image():
    _image_path = os.path.join(
        os.path.dirname(os.path.realpath(__file__)),
        "assets",
        "President_Barack_Obama.jpg",
    )
    image = np.array(PIL.Image.open(_image_path).convert("RGB"))
    return Image(r=image[:, :, 0], g=image[:, :, 1], b=image[:, :, 2], a=None)


@pytest.mark.slow
def test_TORHSCRIPT_CLASSIFIER(
    mock_flojoy_decorator,
    mock_flojoy_venv_cache_directory,
    obama_image,
    torchscript_model_path,
    class_names,
):
    import TORCHSCRIPT_CLASSIFIER

    # Test the model
    clf_output = TORCHSCRIPT_CLASSIFIER.TORCHSCRIPT_CLASSIFIER(
        input_image=obama_image,
        model_path=torchscript_model_path,
        class_names=class_names,
    )

    assert clf_output.m.iloc[0].class_name == "suit, suit of clothes"
