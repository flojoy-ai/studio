from os import path

import numpy as np
import pandas as pd
from flojoy import DataFrame, File, flojoy
from scipy.io import loadmat


@flojoy
def OPEN_MATLAB(file_path: File | None = None) -> DataFrame:
    """The OPEN_MATLAB node loads a local file of the .mat file format.

    Note that if multiple 'tabs' of data are used, the number of rows must match in order to stack the arrays.

    Parameters
    ----------
    file_path : File
        path to the file to be loaded

    Returns
    -------
    DataFrame
        DataFrame loaded from the .mat file
    """

    if file_path == "":
        file_path = path.join(
            path.dirname(path.abspath(__file__)),
            "assets",
            "default.mat",
        )

    if file_path[-4:] != ".mat":
        raise ValueError(f"File type {file_path[-4:]} unsupported.")

    if not path.exists(file_path):
        raise ValueError("File path does not exist!")

    mat = loadmat(file_path)
    key = list(mat.keys())[3:]
    X = mat[key[0]]
    Y = mat[key[1]]

    df = pd.DataFrame(np.hstack((X, Y)))

    return DataFrame(df=df)
