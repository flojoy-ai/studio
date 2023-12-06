import numpy as np


def test_RAND_single_value_uniform(mock_flojoy_decorator):
    import RAND

    res = RAND.RAND(size=1, distribution="uniform", lower_bound=0, upper_bound=1)
    assert res.c < 1
    assert res.c > 0


def test_RAND_array_value_uniform(mock_flojoy_decorator):
    import RAND

    size = 100000
    res = RAND.RAND(size=size, distribution="uniform", lower_bound=0, upper_bound=1)
    assert res.v.shape[0] == size
    assert np.all(res.v < 1)
    assert np.all(res.v > 0)


def test_RAND_single_value_normal(mock_flojoy_decorator):
    import RAND

    res = RAND.RAND(
        size=1, distribution="normal", normal_mean=0, normal_standard_deviation=1
    )
    assert abs(res.c) < 5


def test_RAND_array_value_normal(mock_flojoy_decorator):
    import RAND

    size = 100000
    res = RAND.RAND(
        size=size, distribution="normal", normal_mean=0, normal_standard_deviation=1
    )
    # Test for shape
    assert res.v.shape[0] == size
    # Test for mean and std
    assert abs(np.mean(res.v)) < 0.01
    assert abs(np.std(res.v) - 1) < 0.01


def test_RAND_single_value_poisson(mock_flojoy_decorator):
    import RAND

    res = RAND.RAND(size=1, default=None, distribution="poisson", poisson_events=1)
    assert isinstance(res.c, float)
    assert res.c < 10


def test_RAND_array_value_poisson(mock_flojoy_decorator):
    import RAND

    size = 100000
    res = RAND.RAND(size=size, distribution="poisson", poisson_events=1)
    assert res.v.shape[0] == size
    assert abs(np.mean(res.v) - 1) < 0.015
