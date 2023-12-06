import numpy as np
from flojoy import Vector


def test_PRINT_DATACONTAINER(mock_flojoy_decorator):
    import PRINT_DATACONTAINER

    input = Vector(v=np.arange(0, 50))
    res = PRINT_DATACONTAINER.PRINT_DATACONTAINER(input)

    assert res.text_blob == str(input)
