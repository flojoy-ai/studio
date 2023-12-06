import numpy as np
from flojoy import Vector


def test_DC_CONTENT_TYPE(mock_flojoy_decorator):
    import DC_CONTENT_TYPE

    input = Vector(v=np.arange(0, 50))
    res = DC_CONTENT_TYPE.DC_CONTENT_TYPE(input)

    assert res.s == f"v: {type(np.arange(0, 50))}"
