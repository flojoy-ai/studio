from os import path
from flojoy import flojoy, DataFrame
import pandas as pd


@flojoy(deps={"pyarrow": "12.0.1", "fastparquet": "2023.7.0"})
def OPEN_PARQUET(file_path: str = "") -> DataFrame:
    """Load a local parquet file, then return the data as a dataframe.

    Inputs
    ------
    default: None

    Parameters
    ----------
    file_path : str
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
