import pytest
import os
from flojoy.flojoy_python import cache_huggingface_to_flojoy
from flojoy.utils import get_hf_hub_cache_path


def test_cache_huggingface_to_flojoy_decorator():
    os.environ["HF_HOME"] = "test"

    def test_func():
        return os.environ.get("HF_HOME")

    test_func = cache_huggingface_to_flojoy()(test_func)
    assert os.environ.get("HF_HOME") == "test"
    assert test_func() == get_hf_hub_cache_path()
    assert os.environ.get("HF_HOME") == "test"
