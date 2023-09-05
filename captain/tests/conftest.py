import pytest
import flojoy
from importlib import reload


@pytest.fixture
def reload_flojoy():
    reload(flojoy)
