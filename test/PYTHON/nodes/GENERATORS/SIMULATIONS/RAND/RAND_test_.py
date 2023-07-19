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

import RAND


def test_RAND():
    x = np.linspace(0, 10, 1000)

    element = DataContainer(type="ordered_pair", x=x, y=x)

    # node under test
    res = RAND.RAND([element], {"distribution": "normal"})

    # Check if they are equal
    assert res.y.shape == (1000,)
