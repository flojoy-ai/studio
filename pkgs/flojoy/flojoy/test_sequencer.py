import logging
import os
import pandas as pd
from PIL import Image
import tempfile


# ------ Public ------

__all__ = [
    'export',
    'get_most_recent_data',
    'set_output_loc',
    'NoDataFoundError'
]


def export(data: Image.Image | pd.DataFrame | bool | int):
    """ Export data so it can be retrieved by the test sequencer """
    output_dir, prefix_file = _get_location()
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    if isinstance(data, Image.Image):
        data.save(os.path.join(output_dir, prefix_file + IMAGE))
    elif isinstance(data, pd.DataFrame):
        data.to_csv(os.path.join(output_dir, prefix_file + DATAFRAME))
    elif isinstance(data, bool):
        with open(os.path.join(output_dir, prefix_file + BOOLEAN), 'w') as f:
            f.write(str(data))
    elif isinstance(data, int):
        with open(os.path.join(output_dir, prefix_file + SCALAR), 'w') as f:
            f.write(str(data))
    else:
        raise ValueError("Unsupported data type")


def get_most_recent_data(test_id: str | None, rm_file: bool = False):
    """
    Get the most recent data produce in a test run in the test sequencer.
    @params:
        - test_id: str | None: The prefix used to find the data files. If None, the default prefix is used.
        - rm_file: bool: If True, the file is removed after being read.
    """
    if test_id is not None:
        set_output_loc(test_id)

    output_dir, prefix_file = _get_location()
    output_file = _get_most_recent_file(output_dir, prefix_file)

    if output_file is None:
        return None

    if rm_file:
        os.remove(output_dir + output_file)

    return _extract_data(output_dir + output_file)


def set_output_loc(prefix: str | None):
    """
    Set the output location for the data when launching a test in the test sequencer.
    """
    if prefix is not None:
        os.environ[OPTIONAL_NAME_ENV] = prefix
    else:
        os.environ.pop(OPTIONAL_NAME_ENV)


class NoDataFoundError(Exception):
    """ Raised when no data is found """
    pass


# ------ Private ------


DEFAULT_PATH = os.path.join(tempfile.gettempdir(), 'flojoy/')
OPTIONAL_PATH_ENV = 'FLOJOY_DATA_PATH'
DEFAULT_NAME = 'output'
OPTIONAL_NAME_ENV = 'FLOJOY_DATA_NAME'

IMAGE = "_img.png"
DATAFRAME = "_dataframe.csv"
BOOLEAN = "_boolean.txt"
SCALAR = "_scalar.txt"


def _get_location():
    output_dir = os.environ.get(OPTIONAL_PATH_ENV)
    prefix_file = os.environ.get(OPTIONAL_NAME_ENV)
    if output_dir is None:
        output_dir = DEFAULT_PATH
    if prefix_file is None:
        prefix_file = DEFAULT_NAME

    return output_dir, prefix_file


def _get_most_recent_file(output_dir: str, prefix_file: str):
    most_recent_file = None
    most_recent_time = 0
    for file in os.listdir(output_dir):
        logging.info(f"Available data: {file}")
        if file.startswith(prefix_file):
            file_path = os.path.join(output_dir, file)
            file_time = os.path.getmtime(file_path)
            if file_time > most_recent_time:
                most_recent_time = file_time
                most_recent_file = file

    return most_recent_file


def _extract_data(path: str):
    if path.endswith(IMAGE):
        return Image.open(path)
    if path.endswith(DATAFRAME):
        return pd.read_csv(path, index_col=0)
    if path.endswith(BOOLEAN):
        with open(path, 'r') as f:
            str_bool = f.read().strip().lower()
            return str_bool == 'true' or str_bool == '1'
    if path.endswith(SCALAR):
        return int(open(path, 'r').read())
    raise ValueError("Unknown file type")

