from flojoy import flojoy, DataFrame, Matrix
import pandas as pd
from sklearn import svm, preprocessing
from typing import Literal


@flojoy(deps={"scikit-learn": "1.2.2"})
def SUPPORT_VECTOR_MACHINE(
    train_feature: DataFrame | Matrix,
    train_label: DataFrame | Matrix,
    input_data: DataFrame | Matrix,
    kernel: Literal["linear", "poly", "rbf", "sigmoid", "precomputed"] = "linear",
) -> DataFrame:
    """Train a support vector machine (SVM) model for classification tasks.

    It takes two dataframes of label and feature from labelled training data and a dataframe of unlabelled input data.

    Parameters
    ----------
    kernel : 'linear' | 'poly' | 'rbf' | 'sigmoid' | 'precomputed'
        Specifies the kernel type to be used in the algorithm.
        For detailed information about kernel types:
        https://scikit-learn.org/stable/modules/svm.html#kernel-functions

    Returns
    -------
    DataFrame
        The predictions for the input data.
    """

    le = preprocessing.LabelEncoder()

    if isinstance(train_feature, DataFrame):
        train = train_feature.m.to_numpy()
        col = train_label.m.to_numpy()
        target_name = train_label.m.columns.values[0]

    else:
        train = train_feature.m
        col = train_label.m
        target_name = "target"

    X = train
    Y = le.fit_transform(col)

    clf = svm.SVC(kernel=kernel)
    clf.fit(X, Y)

    if isinstance(input_data, DataFrame):
        input_arr = input_data.m.to_numpy()
    else:
        input_arr = input_data.m

    prediction = clf.predict(input_arr)
    prediction = le.inverse_transform(prediction)
    prediction = pd.DataFrame({target_name: prediction})
    return DataFrame(df=prediction)
