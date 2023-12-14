import os

from flojoy import DataContainer, FlojoyCloud, flojoy, get_env_var, node_preflight

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
    measurement_id: str,
) -> DataContainer:
    """Download a DataContainer from Flojoy Cloud (beta).

    Parameters
    ----------
    measurement_id: str
        The measurement id of the measurement to be downloaded from Flojoy Cloud.

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

    if measurement_id is None or not measurement_id.startswith("dc_"):
        raise KeyError(
            "You must provide a valid data container id in order to download from Flojoy Cloud!"
        )

    cloud = FlojoyCloud(api_key=api_key)

    return cloud.to_dc(cloud.fetch_dc(measurement_id))
