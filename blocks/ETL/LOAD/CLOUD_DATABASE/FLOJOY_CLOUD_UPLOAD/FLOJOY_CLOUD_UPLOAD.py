from typing import Literal

from flojoy import DataContainer, FlojoyCloud, flojoy, get_env_var, node_preflight


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
    hardware_device_id: str,
    name: str,
    status: Literal["None", "Pass", "Fail"] = "None",
) -> DataContainer:
    """Upload a DataContainer to Flojoy Cloud (beta).

    Flojoy Cloud is still in beta, feel free to try it out and give us feedback!

    Parameters
    ----------
    hardware_device_id : str
        The measurement id of the data to be uploaded to Flojoy Cloud.
    name: str
        The name of the data to be uploaded to Flojoy Cloud.

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

    if hardware_device_id is None or not hardware_device_id.startswith("meas_"):
        raise KeyError(
            "You must provide a valid measurement id in order to upload to Flojoy Cloud!"
        )

    cloud = FlojoyCloud(api_key=api_key)

    if default:
        # This will stream the data to the cloud
        cloud.store_dc(
            default,
            default.type,
            hardware_device_id,
            name,
            None if status == "None" else status,
        )

    return default
