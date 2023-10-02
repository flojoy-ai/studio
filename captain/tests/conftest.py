from importlib import reload

import flojoy
import pytest


@pytest.fixture
def reload_flojoy():
    reload(flojoy)
