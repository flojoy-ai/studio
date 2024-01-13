from flojoy import flojoy, DataContainer


@flojoy
def CI_TEST(
    default: DataContainer,
) -> DataContainer:
    """Doing nothing, just a node to test the CI

    Let's see if we can generate the docs, please ignore for now.

    Parameters
    ----------
    default: DataContainer
        The input data container.

    Returns
    -------
    DataContainer
        The output data container
    """

    return None
