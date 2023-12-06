import numpy as np
from flojoy import Scalar


def test_SECOND_ORDER_SYSTEM(mock_flojoy_decorator):
    import SECOND_ORDER_SYSTEM
    from flojoy import DefaultParams

    defaultP = DefaultParams(
        node_id="SECOND_ORDER_SYSTEM", job_id="0", jobset_id="0", node_type="default"
    )

    # TODO: rewrite this test using a mock SmallMemory.
    x = 0.5
    c = Scalar(c=x)

    res = SECOND_ORDER_SYSTEM.SECOND_ORDER_SYSTEM(default=c, default_params=defaultP)

    assert np.allclose(res.c, 0.0, atol=1e-03)
