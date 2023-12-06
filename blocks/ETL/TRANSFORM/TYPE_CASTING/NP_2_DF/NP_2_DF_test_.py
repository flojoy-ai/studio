import pandas as pd
import numpy as np
from flojoy import (
    DataFrame,
    OrderedPair,
    OrderedTriple,
    Matrix,
    Grayscale,
    Image,
    ParametricDataFrame,
    ParametricOrderedPair,
    ParametricGrayscale,
    Vector,
)


# Test case DataFrame and ParametricDataFrame
def test_NP_2_DF_dataframe(mock_flojoy_decorator):
    import NP_2_DF

    # Case DataFrame
    df = DataFrame(
        pd.DataFrame({"hello": [0, 1, 2], "hi": [3, 4, 5], "world": [6, 7, 8]})
    )
    out = NP_2_DF.NP_2_DF(df)
    assert out == df

    # Case ParametricDataFrame
    param_df = ParametricDataFrame(
        df=pd.DataFrame({"hello": [0, 1, 2], "hi": [3, 4, 5], "world": [6, 7, 8]}),
        t=np.array([[8, 7, 6], [5, 4, 3], [2, 1, 0]]),
    )
    param_out = NP_2_DF.NP_2_DF(param_df)
    assert param_out == param_df


# Test case OrderedPair and ParametricOrderedPair
def test_NP_2_DF_orderedpair(mock_flojoy_decorator):
    import NP_2_DF

    # Case OrderedPair
    ordPair = OrderedPair(x=np.array([0, 1]), y=np.array([2, 3]))
    out = NP_2_DF.NP_2_DF(ordPair)
    assert out.m.equals(pd.DataFrame(ordPair.y))

    # Case ParametricOrderedPair
    param_ordPair = ParametricOrderedPair(
        x=np.array([0, 1]), y=np.array([2, 3]), t=np.array([[2, 3], [0, 1]])
    )
    param_out = NP_2_DF.NP_2_DF(param_ordPair)
    assert param_out.m.equals(pd.DataFrame(param_ordPair.y))


# Test case OrderedTriple
def test_NP_2_DF_orderedtriple(mock_flojoy_decorator):
    import NP_2_DF

    ordTriple = OrderedTriple(
        x=np.array([0, 1]), y=np.array([2, 3]), z=np.array([4, 5])
    )
    out = NP_2_DF.NP_2_DF(ordTriple)
    assert out.m.equals(pd.DataFrame(ordTriple.z))


# Test case Matrix
def test_NP_2_DF_matrix(mock_flojoy_decorator):
    import NP_2_DF

    mat = Matrix(m=[[0, 1], [2, 3], [4, 5], [6, 7]])
    out = NP_2_DF.NP_2_DF(mat)
    assert out.m.equals(pd.DataFrame(np.asarray(mat.m)))


# Test case Grayscale and ParametricGrayscale
def test_NP_2_DF_grayscale(mock_flojoy_decorator):
    import NP_2_DF

    # Case Grayscale
    image = Grayscale(img=[[0, 1, 2], [3, 4, 5]])
    out = NP_2_DF.NP_2_DF(image)
    assert out.m.equals(pd.DataFrame(np.asarray(image.m)))

    # Case ParametricGrayscale
    param_image = ParametricGrayscale(img=[[0, 1, 2], [3, 4, 5]], t=[0, 0])
    out = NP_2_DF.NP_2_DF(param_image)
    assert out.m.equals(pd.DataFrame(np.asarray(param_image.m)))


# Test case Image
def test_NP_2_DF_image(mock_flojoy_decorator):
    import NP_2_DF

    # With a not None
    image_a = Image(
        r=[[1, 2], [3, 4]],
        g=[[5, 6], [7, 8]],
        b=[[9, 10], [11, 12]],
        a=[[1, 1], [1, 1]],
    )
    out_a = NP_2_DF.NP_2_DF(image_a)
    result_a = [[1, 5, 9, 1], [2, 6, 10, 1], [3, 7, 11, 1], [4, 8, 12, 1]]
    assert out_a.m.equals(pd.DataFrame(np.asarray(result_a)))

    # With a None
    image = Image(
        r=[[0, 1, 2], [32, 50, 45], [162, 250, 255]],
        g=[[4, 5, 6], [30, 40, 50], [160, 200, 240]],
        b=[[8, 9, 10], [70, 80, 90], [190, 220, 250]],
    )
    out = NP_2_DF.NP_2_DF(image)
    result = [
        [0, 4, 8],
        [1, 5, 9],
        [2, 6, 10],
        [32, 30, 70],
        [50, 40, 80],
        [45, 50, 90],
        [162, 160, 190],
        [250, 200, 220],
        [255, 240, 250],
    ]
    assert out.m.equals(pd.DataFrame(np.asarray(result)))


# Test case when none and raise an error message.
def test_NP_2_DF_none(mock_flojoy_decorator):
    import NP_2_DF

    vec = Vector(v=[[0, 1], [2, 3], [4, 5], [6, 7]])
    np.testing.assert_raises_regex(
        ValueError,
        "unsupported DataContainer type passed for NP_2_DF",
        NP_2_DF.NP_2_DF,
        vec,
    )
