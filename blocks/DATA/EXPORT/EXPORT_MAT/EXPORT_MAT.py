import os
import pandas as pd
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
from scipy.io import savemat
from typing import Literal


@flojoy
def EXPORT_MAT(
    dc: OrderedPair | OrderedTriple | DataFrame | Matrix,
    dir: Directory,
    filename: str = "exported.csv",
    format: Literal["5", "4"] = "5",
    long_field_names: bool = False,
    do_compression: bool = False,
) -> Optional[DataContainer]:
    """Export a Dataframe into MAT-file.

    Parameters
    ----------
    dc : OrderedPair|OrderedTriple|DataFrame
        The DataContainer to export.
    dir : Directory
        The directory to export to.
    filename : str
        The name of the file to output.
    format : Literal["4", "5"]
        '5' (the default) for MATLAB 5 and up (to 7.2),
        '4' for MATLAB 4 .mat files.
    long_field_names : bool, optional
        False - maximum field name length in a structure is 31 characters which is the documented maximum length.
        True - maximum field name length in a structure is 63 characters which works for MATLAB 7.6+.
    do_compression : bool
        Whether or not to compress matrices on write.

    Returns
    -------
    None
    """

    if dir is None:
        raise ValueError("Please select a directory to export the data to")

    filename = f"{filename}.mat" if filename[-4:] != ".mat" else filename
    path = os.path.join(dir.unwrap(), filename)

    np_array_dict = None
    match dc:
        case OrderedPair() | OrderedTriple():
            df = pd.DataFrame(dc)
            df = df.drop(columns=["type", "extra"])
            np_array_dict = {name: col.values for name, col in df.items()}
        case DataFrame():
            df = dc.m
            np_array_dict = {name: col.values for name, col in df.items()}
        case Matrix():
            np_array_dict = {"matrix": dc.m}
        case _:
            raise ValueError(
                f"Invalid DataContainer type: {dc.type} cannot be exported as MAT."
            )

    savemat(
        path,
        np_array_dict,
        format=format,
        long_field_names=long_field_names,
        do_compression=do_compression,
    )

    return None
