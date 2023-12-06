from flojoy import flojoy, DataFrame
from plotly.express import data
from typing import Literal


@flojoy
def PLOTLY_DATASET(
    dataset_key: Literal[
        "wind",
        "iris",
        "carshare",
        "tips",
        "election",
        "experiment",
        "gapminder",
        "medals_long",
        "medals_wide",
        "stocks",
    ] = "wind",
) -> DataFrame:
    """Retrieve a pandas DataFrame from one of Plotly Express's built-in datasets.

    Parameters
    ----------
    dataset_key : str

    Returns
    -------
    DataFrame
    """

    df = getattr(data, dataset_key)()

    return DataFrame(df=df)
