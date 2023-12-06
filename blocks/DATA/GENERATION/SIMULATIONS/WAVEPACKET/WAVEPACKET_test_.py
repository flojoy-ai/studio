import numpy as np


def test_WAVEPACKET(mock_flojoy_decorator):
    import WAVEPACKET
    from flojoy import DefaultParams

    default = DefaultParams(
        node_id="WAVEPACKET", job_id="0", jobset_id="0", node_type="default"
    )

    # node under test
    res = WAVEPACKET.WAVEPACKET(default_params=default)

    # check that the correct number of elements
    assert (len(res.y)) == 1000
    assert (len(res.x)) == 1000
    assert np.greater_equal(res.y, 0).all()
