import os
from flojoy import DataContainer, flojoy, get_env_var, node_preflight, FlojoyCloud


FLOJOY_CLOUD_URI: str = os.environ.get("FLOJOY_CLOUD_URI") or "https://cloud.flojoy.ai"


@node_preflight
def preflight():
    api_key = get_env_var("FLOJOY_CLOUD_KEY")

    if api_key is None:
        raise KeyError(
            "Flojoy Cloud key is not found! You can set it under Settings -> Environment Variables."
        )


@flojoy
def FLOJOY_CLOUD_DOWNLOAD(
    data_container_id: str,
) -> DataContainer:
    """Download a DataContainer from Flojoy Cloud (beta).

    Parameters
    ----------
    data_container_id : str
        The data container id of the data to be downloaded from Flojoy Cloud.

    Returns
    -------
    DataContainer
        The downloaded DataContainer will be returned as it is.
    """

    api_key = get_env_var("FLOJOY_CLOUD_KEY")

    if api_key is None:
        raise KeyError(
            "Flojoy Cloud key is not found! You can set it under Settings -> Environment Variables."
        )

    if data_container_id is None or not data_container_id.startswith("dc_"):
        raise KeyError(
            "You must provide a valid data container id in order to download from Flojoy Cloud!"
        )

    cloud = FlojoyCloud(api_key=api_key)

    return cloud.to_dc(cloud.fetch_dc(data_container_id))
