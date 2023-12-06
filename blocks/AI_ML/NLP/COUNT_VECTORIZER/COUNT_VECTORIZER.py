from typing import TypedDict
from sklearn.feature_extraction.text import CountVectorizer
from flojoy import flojoy, DataFrame, Matrix, Vector
import pandas as pd


class CountVectorizerOutput(TypedDict):
    tokens: DataFrame
    word_count_vector: Vector


@flojoy(deps={"scikit-learn": "1.2.2"})
def COUNT_VECTORIZER(default: DataFrame | Matrix | Vector) -> CountVectorizerOutput:
    """Receive a collection of text documents (as a matrix, vector, or dataframe) and convert it into a matrix of token counts.

    Parameters
    ----------
    default : DataFrame|Matrix|Vector
        The corpus to vectorize.

    Returns
    -------
    tokens: DataFrame
        Holds all the unique tokens observed from the input.
    word_count_vector: Vector
        Contains the occurences of these tokens from each sentence.
    """

    if isinstance(default, DataFrame):
        data = default.m.values
    elif isinstance(default, Vector):
        data = default.v
    else:
        data = default.m

    vectorizer = CountVectorizer()
    X = vectorizer.fit_transform(data.flatten())

    x = pd.DataFrame({"tokens": vectorizer.get_feature_names_out()})
    y = X.toarray()  # type: ignore

    return CountVectorizerOutput(tokens=DataFrame(df=x), word_count_vector=Vector(v=y))
