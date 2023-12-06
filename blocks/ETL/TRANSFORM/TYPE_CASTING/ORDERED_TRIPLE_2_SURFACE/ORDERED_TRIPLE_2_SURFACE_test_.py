from flojoy import OrderedTriple
import numpy as np


def test_ORDERED_TRIPLE_2_SURFACE_general(mock_flojoy_decorator):
    import ORDERED_TRIPLE_2_SURFACE

    ordTriple = OrderedTriple(
        x=np.array([0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3]),
        y=np.array([0, 1, 2, 0, 1, 2, 0, 1, 2, 0, 1, 2]),
        z=np.array([0.0, 3.9, 2.4, 5.0, 1.2, 3.3, 3.4, 3.5, 0.9, 8.7, 5.6, 7.1]),
    )
    out = ORDERED_TRIPLE_2_SURFACE.ORDERED_TRIPLE_2_SURFACE(ordTriple)

    np.testing.assert_array_equal(([[0, 1, 2, 3], [0, 1, 2, 3], [0, 1, 2, 3]]), out.x)
    np.testing.assert_array_equal(([[0, 0, 0, 0], [1, 1, 1, 1], [2, 2, 2, 2]]), out.y)
    np.testing.assert_array_equal(
        ([[0.0, 3.9, 2.4, 5.0], [1.2, 3.3, 3.4, 3.5], [0.9, 8.7, 5.6, 7.1]]), out.z
    )


def test_ORDERED_TRIPLE_2_SURFACE_with_padding(mock_flojoy_decorator):
    import ORDERED_TRIPLE_2_SURFACE

    # Test with x,y not unique and len(z) smaller
    ordTriple1 = OrderedTriple(
        x=np.array([0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3]),
        y=np.array([0, 1, 2, 0, 1, 2, 0, 1, 2, 0, 1, 2]),
        z=np.array([0.0, 3.9, 2.4, 5.0, 1.2, 3.3, 3.4, 3.5, 0.9]),
    )
    out1 = ORDERED_TRIPLE_2_SURFACE.ORDERED_TRIPLE_2_SURFACE(ordTriple1)

    assert len(out1.z) == len(np.unique(ordTriple1.y))
    np.testing.assert_array_equal(
        [[0.0, 3.9, 2.4, 5.0], [1.2, 3.3, 3.4, 3.5], [0.9, 0.0, 0.0, 0.0]], out1.z
    )

    # Test with x,y unique and len(z) smaller then len(x)*len(y)
    ordTriple2 = OrderedTriple(
        x=np.array([0, 1, 2, 3]),
        y=np.array([0, 1, 2, 3]),
        z=np.array([8.0, 5.5, 2.4, 6.7, 1.3, 0.9, 5.4, 3.2, 2.2, 1.0]),
    )
    out2 = ORDERED_TRIPLE_2_SURFACE.ORDERED_TRIPLE_2_SURFACE(ordTriple2)

    np.testing.assert_array_equal(
        [
            [8.0, 5.5, 2.4, 6.7],
            [1.3, 0.9, 5.4, 3.2],
            [2.2, 1.0, 0.0, 0.0],
            [0.0, 0.0, 0.0, 0.0],
        ],
        out2.z,
    )


def test_ORDERED_TRIPLE_2_SURFACE_no_padding(mock_flojoy_decorator):
    import ORDERED_TRIPLE_2_SURFACE

    # Test with x,y unique and len(z) bigger
    ordTriple1 = OrderedTriple(
        x=np.array([0, 1, 2, 3]),
        y=np.array([0, 1]),
        z=np.array([8.0, 5.5, 2.4, 6.7, 1.3, 0.9, 7.9, 4.5, 3.3, 6.6, 4.4, 8.8, 9.9]),
    )
    out1 = ORDERED_TRIPLE_2_SURFACE.ORDERED_TRIPLE_2_SURFACE(ordTriple1)

    np.testing.assert_array_equal([[8.0, 5.5, 2.4, 6.7], [1.3, 0.9, 7.9, 4.5]], out1.z)

    # Test with x,y not unique and len(z) bigger then len(unique(x))*len(unique(y))
    ordTriple2 = OrderedTriple(
        x=np.array([0, 1, 2, 0, 1, 2, 0, 1, 2]),
        y=np.array([0, 0, 0, 1, 1, 1, 2, 2, 2]),
        z=np.array([8.0, 5.5, 2.4, 6.7, 1.3, 0.9, 5.6, 4.3, 7.7, 8.8, 9.9, 6.6]),
    )
    out2 = ORDERED_TRIPLE_2_SURFACE.ORDERED_TRIPLE_2_SURFACE(ordTriple2)

    np.testing.assert_array_equal(
        [[8.0, 5.5, 2.4], [6.7, 1.3, 0.9], [5.6, 4.3, 7.7]], out2.z
    )
