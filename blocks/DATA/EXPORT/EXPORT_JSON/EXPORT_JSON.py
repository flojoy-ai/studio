import os
import json
from flojoy import (
    flojoy,
    DataContainer,
    Directory,
)
from flojoy.utils import PlotlyJSONEncoder
from typing import Optional


@flojoy
def EXPORT_JSON(
    dc: DataContainer,
    dir: Directory,
    filename: str = "exported.json",
) -> Optional[DataContainer]:
    """Export data into JSON format.

    Parameters
    ----------
    dc : DataContainer
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

    data = dc.to_dict()
    del data["extra"]

    with open(os.path.join(dir.unwrap(), filename), "w+") as f:
        json.dump(data, f, cls=PlotlyJSONEncoder)

    return None
