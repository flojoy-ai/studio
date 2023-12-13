from os import path

import pandas as pd
from flojoy import DataFrame, File, flojoy


@flojoy(deps={"pyarrow": "12.0.1", "fastparquet": "2023.7.0"})
def OPEN_PARQUET(file_path: File | None = None) -> DataFrame:
    """Load a local parquet file, then return the data as a dataframe.

    Inputs
    ------
    default: None

    Parameters
    ----------
    file_path : File
        File path to the .parquet file or an URL of a .parquet file.

    Returns
    -------
    DataFrame
        DataFrame loaded from .parquet file
    """

    if file_path[-8:] != ".parquet":
        raise ValueError(f"File type {file_path[-8:]} unsupported.")

    if not path.exists(file_path):
        raise ValueError("File path does not exist!")

    read_parquet = pd.read_parquet(file_path)

    return DataFrame(df=read_parquet)
