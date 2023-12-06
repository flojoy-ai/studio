from typing import Optional

import pandas as pd
from flojoy import DataFrame, flojoy


@flojoy
def ONE_HOT_ENCODING(
    data: DataFrame,
    feature_col: Optional[DataFrame] = None,
) -> DataFrame:
    """Create a one-hot encoding from a dataframe containing categorical features.

    Parameters
    ----------
    data : DataFrame
        The input dataframe containing the categorical features.
    feature_col: DataFrame, optional
        A dataframe whose columns are used to create the one hot encoding.
        For example, if 'data' has columns ['a', 'b', 'c'] and 'feature_col' has columns ['a', 'b'],
        then the one hot encoding will be created only for columns ['a', 'b'] against 'data'.
        Defaults to None, meaning that all columns of categorizable objects are encoded.

    Returns
    -------
    DataFrame
        The one hot encoding of the input features.
    """

    df = data.m
    if feature_col:
        encoded = pd.get_dummies(df, columns=feature_col.m.columns.to_list())

    else:
        cat_df = df.select_dtypes(include=["object", "category"]).columns.to_list()
        encoded = pd.get_dummies(df, columns=cat_df)

    return DataFrame(df=encoded)
