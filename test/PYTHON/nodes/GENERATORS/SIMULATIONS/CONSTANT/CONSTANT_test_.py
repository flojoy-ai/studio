import numpy as np

from functools import wraps
from unittest.mock import patch

from flojoy import DataContainer


def mock_flojoy_decorator(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        return f(*args, **kwargs)

    return decorated_function


patch("flojoy.flojoy", mock_flojoy_decorator).start()

import CONSTANT


def test_CONSTANT():
    # node under test
    res = CONSTANT.CONSTANT([], {"constant": 2})

    # Check if they are equal
    assert res.c == 2
