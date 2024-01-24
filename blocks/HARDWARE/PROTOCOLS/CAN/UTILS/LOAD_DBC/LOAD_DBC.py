from flojoy import flojoy, File, Stateful
from cantools import database


@flojoy(deps={"python-can": "4.2.2", "cantools": "39.4.2"})
def LOAD_DBC(file_path: File) -> Stateful:
    """Load a DBC file.

    Open and parse a given database file. The database format is inferred from the file extension.
    This block is compatible with the following database format. `dbc`, `arxml`, `kcd`, `sym`, `cdd`.

    Parameters
    ----------
    file_path : File
        The path to the DBC file.

    Returns
    -------
    Stateful : cantools.database.Database
        Return a cantools database object.
    """

    db = database.load_file(file_path.unwrap())

    return Stateful(db)
