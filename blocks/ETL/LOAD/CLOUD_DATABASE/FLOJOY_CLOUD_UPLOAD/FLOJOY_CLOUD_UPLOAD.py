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
def FLOJOY_CLOUD_UPLOAD(
    default: DataContainer,
    measurement_id: str,
) -> DataContainer:
    """Upload a DataContainer to Flojoy Cloud (beta).

    Flojoy Cloud is still in beta, feel free to try it out and give us feedback!

    Parameters
    ----------
    measurement_id : str
        The measurement id of the data to be uploaded to Flojoy Cloud.

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

    if measurement_id is None or not measurement_id.startswith("meas_"):
        raise KeyError(
            "You must provide a valid measurement id in order to upload to Flojoy Cloud!"
        )

    cloud = FlojoyCloud(api_key=api_key)

    if default:
        # This will stream the data to the cloud

        cloud.store_dc(default, default.type, measurement_id)

    return default
