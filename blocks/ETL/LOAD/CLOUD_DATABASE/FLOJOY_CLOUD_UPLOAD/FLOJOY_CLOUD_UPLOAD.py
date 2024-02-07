import os
from flojoy import DataContainer, flojoy, get_env_var, node_preflight, Boolean, DataFrame
import flojoy_cloud
from typing import Optional
from datetime import datetime

FLOJOY_CLOUD_URI: str = os.environ.get("FLOJOY_CLOUD_URI") or "https://cloud.flojoy.ai"


@node_preflight
def preflight():
    api_key = get_env_var("FLOJOY_CLOUD_KEY")

    if api_key is None:
        raise KeyError(
            "Flojoy Cloud key is not found! You can set it under Settings -> Environment Variables."
        )


@flojoy
def FLOJOY_CLOUD_UPLOAD(
    default: DataContainer,
    hardware_id: str,
    test_id: str,
    name: str | None = None,
    pass_fail: Optional[Boolean] = None
) -> DataContainer:
    """Upload a DataContainer to Flojoy Cloud (beta).

    Flojoy Cloud is still in beta, feel free to try it out and give us feedback!

    Parameters
    ----------
    default : DataContainer
        The data to be uploaded to Flojoy Cloud. Currently only support DataFrame and Boolean.
    hardware_device_id : str
        The measurement id of the data to be uploaded to Flojoy Cloud.
    test_id : str
        The test id of the data to be uploaded to Flojoy Cloud.(In Flojoy Cloud, right click on the desired test to select its "Copy ID"!)
    name: str
        A custom name describing the test.
    pass_fail: Boolean
        Optional parameter to define if the test passed or failed.

    Returns
    -------
    DataContainer
        The input DataContainer will be returned as it is.
    """

    api_key = get_env_var("FLOJOY_CLOUD_KEY")

    if api_key is None:
        raise KeyError(
            "Flojoy Cloud key is not found! You can set it under Settings -> Environment Variables."
        )

    if default:
        # Only upload if the data is not empty, otherwise pass through
        cloud = flojoy_cloud.FlojoyCloud(workspace_secret=api_key)
        data = None
        if isinstance(default, DataFrame):
            data = default.m
        elif isinstance(default, Boolean):
            data = default.b
        else:
            raise TypeError(f"Unsupported data type: {type(default)}")
        cloud.upload(data=data,
                     test_id=test_id,
                     hardware_id=hardware_id,
                     name=name,
                     created_at=datetime.now(),
                     passed=pass_fail.b if pass_fail is not None else None
                     )

    return default
