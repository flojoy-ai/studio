import numpy as np

from flojoy import OrderedPair, Vector, Scalar


def test_DIVIDE_Vector_Vector(mock_flojoy_decorator):
    import DIVIDE

    x = Vector(v=np.arange(10, 20, 1))
    y = Vector(v=np.arange(20, 30, 1))
    res = DIVIDE.DIVIDE(a=x, b=[y])

    np.testing.assert_allclose(res.v, x.v / y.v)


def test_DIVIDE_Vector_Scalar(mock_flojoy_decorator):
    import DIVIDE

    x = Vector(v=np.arange(-10, 10, 1))
    res = DIVIDE.DIVIDE(a=x, b=[Scalar(c=2), Scalar(c=3)])

    np.testing.assert_allclose(res.v, (x.v / 2) / 3)


def test_DIVIDE_OrderedPair_Vector(mock_flojoy_decorator):
    import DIVIDE

    x = np.arange(10, 20, 1)
    y = np.arange(20, 30, 1)
    z = np.arange(30, 40, 1)
    res = DIVIDE.DIVIDE(a=OrderedPair(x=x, y=y), b=[Vector(v=z)])

    np.testing.assert_allclose(res.x, x)
    np.testing.assert_allclose(res.y, y / z)
