import numpy as np
from flojoy import OrderedPair, Vector, Scalar


def test_LOG_Vector_Vector(mock_flojoy_decorator):
    import LOG

    x = Vector(v=np.arange(10, 20, 1))
    y = Vector(v=np.arange(20, 30, 1))
    res = LOG.LOG(a=x, b=[y], log_base="input")
    test = np.log(x.v)
    test /= np.log(y.v)

    np.testing.assert_allclose(res.v, test)


def test_LOG_Vector_Scalar(mock_flojoy_decorator):
    import LOG

    x = Vector(v=np.arange(1, 11, 1))
    res = LOG.LOG(a=x, b=[Scalar(c=2)], log_base="input")
    test = np.log(x.v)
    test /= np.log(2)

    np.testing.assert_allclose(res.v, test)


def test_LOG_OrderedPair_Vector(mock_flojoy_decorator):
    import LOG

    x = np.arange(10, 20, 1)
    y = np.arange(20, 30, 1)
    z = np.arange(30, 40, 1)
    res = LOG.LOG(a=OrderedPair(x=x, y=y), b=[Vector(v=z)], log_base="input")
    test = np.log(y)
    test /= np.log(z)
    print(res.y, flush=True)
    print(test, flush=True)

    np.testing.assert_allclose(res.x, x)
    np.testing.assert_allclose(res.y, test)
