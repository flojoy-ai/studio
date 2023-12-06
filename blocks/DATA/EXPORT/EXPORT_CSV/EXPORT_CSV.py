import pandas as pd
import os
from flojoy import (
    DataFrame,
    OrderedPair,
    OrderedTriple,
    Matrix,
    flojoy,
    DataContainer,
    Directory,
)
from typing import Optional


@flojoy
def EXPORT_CSV(
    dc: OrderedPair | OrderedTriple | DataFrame | Matrix,
    dir: Directory,
    filename: str = "exported.csv",
) -> Optional[DataContainer]:
    """Export a DataContainer into CSV format.

    Parameters
    ----------
    dc : OrderedPair|OrderedTriple|DataFrame
        The DataContainer to export.
    dir : Directory
        The directory to export to.
    filename : str
        The name of the file to output.

    Returns
    -------
    None
    """

    if dir is None:
        raise ValueError("Please select a directory to export the data to")

    path = os.path.join(dir.unwrap(), filename)

    match dc:
        case OrderedPair() | OrderedTriple():
            df = pd.DataFrame(dc)
            df = df.drop(columns=["type", "extra"])
            df.to_csv(path, index=False)
        case DataFrame():
            df = dc.m
            df.to_csv(path, index=False)
        case Matrix():
            df = pd.DataFrame(dc.m)
            df.to_csv(path, index=False, header=False)
        case _:
            raise ValueError(
                f"Invalid DataContainer type: {dc.type} cannot be exported as CSV."
            )

    return None
