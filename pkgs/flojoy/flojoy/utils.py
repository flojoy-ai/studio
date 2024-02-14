import decimal
import json as _json
import os
from pathlib import Path
from typing import Any, Callable

import logging
import numpy as np
import pandas as pd
import yaml

# TODO(roulbac): Remove these imports once the nodes using them have been
# tested and updated to use huggingface_hub directly
from huggingface_hub import hf_hub_download
from huggingface_hub import snapshot_download

from flojoy.connection_manager import DeviceConnectionManager
from .dao import Dao
from .config import FlojoyConfig, logger
from .env_var import get_env_var
from .node_init import NodeInit, NodeInitService

import base64
from .CONSTANTS import FLOJOY_DIR, FLOJOY_CACHE_DIR, CREDENTIAL_FILE


__all__ = [
    "get_credentials",
    "hf_hub_download",
    "snapshot_download",
    "hf_hub_download",
    "snapshot_download",
    "clear_flojoy_memory",
]


# # package result
# def package_result(result: dict | None, fn: str, node_id: str, jobset_id: str) -> dict:
#     return {
#         "NODE_RESULTS": {
#             "cmd": fn,
#             "id": node_id,
#             "result": result,
#         },
#         "jobsetId": jobset_id,
#     }

# # package error
# def package_error(func_name, node_id, jobset_id, error):
#     return {
#         "SYSTEM_STATUS": f"Failed to run: {func_name}",
#         "FAILED_NODES": {node_id: str(error)},
#         "jobsetId": jobset_id,
#     }


# Make as a function to mock at test-time
def get_hf_hub_cache_path() -> str:
    """Returns the path to the HuggingFace home directory (HF_HOME) within the Flojoy cache directory
    This is used to cache huggingface artifacts within the Flojoy cache directory."""
    return os.path.join(FLOJOY_CACHE_DIR, "cache", "huggingface")


def set_offline():
    """
    Sets the is_offline flag to True, which means that results will not be sent to the backend via HTTP.
    Mainly used for precompilation
    """
    FlojoyConfig.get_instance().is_offline = True


def set_online():
    """
    Sets the is_offline flag to False, which means that results will be sent to the backend via HTTP.
    """
    FlojoyConfig.get_instance().is_offline = False


def set_debug_on():
    """
    Sets the print_on flag to True, which means that the print statements will be executed.
    """
    logger.setLevel(logging.DEBUG)


def set_debug_off():
    """
    Sets the print_on flag to False, which means that the print statements will not be executed.
    """
    logger.setLevel(logging.INFO)


def clear_flojoy_memory():
    Dao.get_instance().clear_job_results()
    Dao.get_instance().clear_small_memory()
    Dao.get_instance().clear_node_init_containers()
    DeviceConnectionManager.clear()


class PlotlyJSONEncoder(_json.JSONEncoder):
    """
    Meant to be passed as the `cls` kwarg to json.dumps(obj, cls=..)
    See PlotlyJSONEncoder.default for more implementation information.
    Additionally, this encoder overrides nan functionality so that 'Inf',
    'NaN' and '-Inf' encode to 'null'. Which is stricter JSON than the Python
    version.
    """

    def coerce_to_strict(self, const: Any):
        """
        This is used to ultimately *encode* into strict JSON, see `encode`
        """
        # before python 2.7, 'true', 'false', 'null', were include here.
        if const in ("Infinity", "-Infinity", "NaN"):
            return None
        else:
            return const

    def encode(self, o: Any):
        """
        Load and then dump the result using parse_constant kwarg
        Note that setting invalid separators will cause a failure at this step.
        """
        # this will raise errors in a normal-expected way
        encoded_o = super(PlotlyJSONEncoder, self).encode(o)
        # Brute force guessing whether NaN or Infinity values are in the string
        # We catch false positive cases (e.g. strings such as titles, labels etc.)
        # but this is ok since the intention is to skip the decoding / reencoding
        # step when it's completely safe

        if not ("NaN" in encoded_o or "Infinity" in encoded_o):
            return encoded_o

        # now:
        #    1. `loads` to switch Infinity, -Infinity, NaN to None
        #    2. `dumps` again so you get 'null' instead of extended JSON
        try:
            new_o = _json.loads(encoded_o, parse_constant=self.coerce_to_strict)
        except ValueError:
            # invalid separators will fail here. raise a helpful exception
            raise ValueError(
                "Encoding into strict JSON failed. Did you set the separators "
                "valid JSON separators?"
            )
        else:
            return _json.dumps(
                new_o,
                sort_keys=self.sort_keys,
                indent=self.indent,
                separators=(self.item_separator, self.key_separator),
            )

    def default(self, obj: dict[str, Any]):
        """
        Accept an object (of unknown type) and try to encode with priority:
        1. builtin:     user-defined objects
        2. sage:        sage math cloud
        3. pandas:      dataframes/series
        4. numpy:       ndarrays
        5. datetime:    time/datetime objects
        Each method throws a NotEncoded exception if it fails.
        The default method will only get hit if the object is not a type that
        is naturally encoded by json:
            Normal objects:
                dict                object
                list, tuple         array
                str, unicode        string
                int, long, float    number
                True                true
                False               false
                None                null
            Extended objects:
                float('nan')        'NaN'
                float('infinity')   'Infinity'
                float('-infinity')  '-Infinity'
        Therefore, we only anticipate either unknown iterables or values here.
        """
        # TODO: The ordering if these methods is *very* important. Is this OK?
        encoding_methods = (
            self.encode_as_plotly,
            self.encode_as_numpy,
            self.encode_as_pandas,
            self.encode_as_datetime,
            self.encode_as_date,
            self.encode_as_list,  # because some values have `tolist` do last.
            self.encode_as_decimal,
            self.encode_as_base64,
        )
        for encoding_method in encoding_methods:
            try:
                return encoding_method(obj)
            except NotEncodable:
                pass
        return _json.JSONEncoder.default(self, obj)

    @staticmethod
    def encode_as_base64(value: bytes):
        """Attempt to convert to base64."""
        try:
            return base64.b64encode(value).decode()
        except AttributeError:
            raise NotEncodable

    @staticmethod
    def encode_as_plotly(obj: dict[str, Any]):
        """Attempt to use a builtin `to_plotly_json` method."""
        try:
            return obj.to_plotly_json()
        except AttributeError:
            raise NotEncodable

    @staticmethod
    def encode_as_list(obj):
        """Attempt to use `tolist` method to convert to normal Python list."""
        if hasattr(obj, "tolist"):
            return obj.tolist()
        else:
            raise NotEncodable

    @staticmethod
    def encode_as_pandas(obj):
        """Attempt to convert pandas.NaT"""
        if not pd:
            raise NotEncodable
        if obj is pd.NaT:
            return None
        elif isinstance(obj, pd.DataFrame):
            return obj.to_json()
        else:
            raise NotEncodable

    @staticmethod
    def encode_as_numpy(obj):
        """Attempt to convert numpy.ma.core.masked"""
        if not np:
            raise NotEncodable

        if obj is np.ma.masked:
            return float("nan")
        elif isinstance(obj, np.ndarray) and obj.dtype.kind == "M":
            try:
                return np.datetime_as_string(obj).tolist()
            except TypeError:
                pass

        raise NotEncodable

    @staticmethod
    def encode_as_datetime(obj):
        """Convert datetime objects to iso-format strings"""
        try:
            return obj.isoformat()
        except AttributeError:
            raise NotEncodable

    @staticmethod
    def encode_as_date(obj):
        """Attempt to convert to utc-iso time string using date methods."""
        try:
            time_string = obj.isoformat()
        except AttributeError:
            raise NotEncodable
        else:
            return time_string  # iso_to_plotly_time_string(time_string)

    @staticmethod
    def encode_as_decimal(obj):
        """Attempt to encode decimal by converting it to float"""
        if isinstance(obj, decimal.Decimal):
            return float(obj)
        else:
            raise NotEncodable


class NotEncodable(Exception):
    pass


def dump_str(result: Any, limit: int | None = None):
    result_str = str(result)
    return (
        result_str
        if limit is None or len(result_str) <= limit
        else result_str[:limit] + "..."
    )


def get_flojoy_root_dir() -> str:
    home = str(Path.home())
    path = os.path.join(home, ".flojoy/flojoy.yaml")
    stream = open(path, "r")
    yaml_dict = yaml.load(stream, Loader=yaml.FullLoader)
    root_dir = ""

    if isinstance(yaml_dict, str):
        root_dir = yaml_dict.split(":")[1]
    else:
        root_dir = yaml_dict["PATH"]

    return root_dir


def get_credentials() -> list[dict[str, str]]:
    home = str(Path.home())
    file_path = os.path.join(home, os.path.join(FLOJOY_DIR, CREDENTIAL_FILE))

    if not os.path.exists(file_path):
        logger.info(f"{file_path} not exists returning empty list...")
        return []

    with open(file_path, "r") as f:
        keys = f.read().strip().split(",")

    credentials_list: list[dict[str, str]] = []
    for key in keys:
        val = get_env_var(key)
        if val:
            credentials_list.append({"key": key, "value": val})

    return credentials_list


def get_node_init_function(node_func: Callable) -> NodeInit:
    return NodeInitService().get_node_init_function(node_func)
