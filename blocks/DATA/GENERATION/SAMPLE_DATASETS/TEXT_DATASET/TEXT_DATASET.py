from flojoy import flojoy, DataFrame, Array
from sklearn.datasets import fetch_20newsgroups
from sklearn.utils import Bunch
import pandas as pd
from typing import cast, Literal, Optional


# TODO: Add more datasets to this node.
@flojoy
def TEXT_DATASET(
    subset: Literal["train", "test", "all"] = "train",
    categories: Optional[Array] = None,
    remove_headers: bool = False,
    remove_footers: bool = False,
    remove_quotes: bool = False,
) -> DataFrame:
    """Load one of the 20 newsgroup sample datasets from scikit-learn.

    The data is returned as a dataframe with one column containing the text and the other containing the category.

    Parameters
    ----------
    subset : "train" | "test" | "all", default="train"
        Select the dataset to load: "train" for the training set, "test" for the test set, "all" for both.
    categories : list of str, optional
        Select the categories to load. By default, all categories are loaded.
        The list of all categories is:
        'alt.atheism',
        'comp.graphics',
        'comp.os.ms-windows.misc',
        'comp.sys.ibm.pc.hardware',
        'comp.sys.mac.hardware',
        'comp.windows.x',
        'misc.forsale',
        'rec.autos',
        'rec.motorcycles',
        'rec.sport.baseball',
        'rec.sport.hockey',
        'sci.crypt',
        'sci.electronics',
        'sci.med',
        'sci.space',
        'soc.religion.christian',
        'talk.politics.guns',
        'talk.politics.mideast',
        'talk.politics.misc',
        'talk.religion.misc'
    remove_headers : boolean, default=false
        Remove the headers from the data.
    remove_footers : boolean, default=false
        Remove the footers from the data.
    remove_quotes : boolean, default=false
        Remove the quotes from the data.

    Returns
    -------
    DataFrame
    """

    to_remove = tuple(
        ["headers" for remove_headers in [remove_headers] if remove_headers]
        + ["footers" for remove_footers in [remove_footers] if remove_footers]
        + ["quotes" for remove_quotes in [remove_quotes] if remove_quotes]
    )

    newsgroups = fetch_20newsgroups(
        subset=subset,
        categories=categories.unwrap() if categories else None,
        remove=to_remove,
    )

    newsgroups = cast(Bunch, newsgroups)
    data = newsgroups.data
    labels = [newsgroups.target_names[i] for i in newsgroups.target]

    df = pd.DataFrame({"Text": data, "Label": labels})
    return DataFrame(df=df)
