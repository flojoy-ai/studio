from flojoy_cloud import test_sequencer


def test_one():
    x = 5
    assert x == 5


def test_two():
    x = 5
    assert x == 5


def test_three():
    x = 5
    assert x == 5


def test_four_will_fail():
    x = 5
    test_sequencer.export(x)
    assert x == 20
