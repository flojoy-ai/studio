import numpy as np
from flojoy import Matrix, Vector


def test_DOT_PRODUCT(mock_flojoy_decorator):
    import DOT_PRODUCT

    # mat * mat
    x = np.eye(3)
    x[2, 0] = 1
    element = Matrix(m=x)
    res = DOT_PRODUCT.DOT_PRODUCT(a=element, b=element)
    assert np.array_equal(res.m, np.dot(x, x))

    # mat * vec
    x = np.eye(3)
    x[2, 0] = 1
    v = [1, 1, 1]
    a = Matrix(m=x)
    b = Vector(v=v)
    res = DOT_PRODUCT.DOT_PRODUCT(a=a, b=b)
    assert np.array_equal(res.v, np.dot(x, v))

    res = DOT_PRODUCT.DOT_PRODUCT(a=b, b=a)
    assert np.array_equal(res.v, np.dot(v, x))

    # vec * vec
    v = Vector(v=[1, 1, 1])
    res = DOT_PRODUCT.DOT_PRODUCT(a=v, b=v)
    assert np.array_equal(res.c, np.dot([1, 1, 1], [1, 1, 1]))

    # mat * mat - not square
    x = np.ones((4, 3))
    x[0, 0] = 3
    y = np.ones((3, 2))
    y[0, 0] = 3
    print(x, y, flush=True)
    a = Matrix(m=x)
    b = Matrix(m=y)
    res = DOT_PRODUCT.DOT_PRODUCT(a=a, b=b)
    assert np.array_equal(res.m, np.dot(x, y))
