import numpy as np
from flojoy import Vector


def test_DATACONTAINER_TYPE(mock_flojoy_decorator):
    import DATACONTAINER_TYPE

    input = Vector(v=np.arange(0, 50))
    res = DATACONTAINER_TYPE.DATACONTAINER_TYPE(input)

    assert res.s == "Vector"
