import numpy as np

from flojoy import OrderedPair, Vector, Scalar


def test_FLOOR_DIVIDE_Vector_Vector(mock_flojoy_decorator):
    import FLOOR_DIVIDE

    x = Vector(v=np.arange(10, 20, 1))
    y = Vector(v=np.arange(20, 30, 1))
    res = FLOOR_DIVIDE.FLOOR_DIVIDE(a=x, b=[y])

    np.testing.assert_allclose(res.v, np.floor_divide(x.v, y.v))


def test_FLOOR_DIVIDE_Vector_Scalar(mock_flojoy_decorator):
    import FLOOR_DIVIDE

    x = Vector(v=np.arange(-10, 10, 1))
    res = FLOOR_DIVIDE.FLOOR_DIVIDE(a=x, b=Scalar(c=2))

    np.testing.assert_allclose(res.v, np.floor_divide(x.v, 2))


def test_FLOOR_DIVIDE_OrderedPair_Vector(mock_flojoy_decorator):
    import FLOOR_DIVIDE

    x = np.arange(10, 20, 1)
    y = np.arange(20, 30, 1)
    z = np.arange(30, 40, 1)
    res = FLOOR_DIVIDE.FLOOR_DIVIDE(a=OrderedPair(x=x, y=y), b=[Vector(v=z)])

    np.testing.assert_allclose(res.x, x)
    np.testing.assert_allclose(res.y, np.floor_divide(y, z))
