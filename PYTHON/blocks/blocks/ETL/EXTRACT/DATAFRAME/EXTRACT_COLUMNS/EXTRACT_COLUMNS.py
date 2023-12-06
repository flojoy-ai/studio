import numpy as np
from flojoy import Array, DataFrame, Matrix, flojoy


@flojoy
def EXTRACT_COLUMNS(default: DataFrame | Matrix, columns: Array) -> DataFrame:
    """Take an input dataframe/matrix and returns a dataframe/matrix with only the specified columns.

    Parameters
    ----------
    default : DataFrame|Matrix
        Input to use as the table for column extraction
    columns : list of str or list of int
        The columns to extract from the input dataframe

    Returns
    -------
    DataFrame|Matrix
        DataFrame or Matrix with only the specified columns
    """

    if isinstance(default, DataFrame):
        df = default.m
        new_df = df[columns.unwrap()] if columns else df
        return DataFrame(df=new_df)
    else:
        matrix = default.m
        indices = np.array(columns.unwrap(), dtype=int)
        new_matrix = matrix[:, indices] if columns else matrix
        return Matrix(m=new_matrix)
