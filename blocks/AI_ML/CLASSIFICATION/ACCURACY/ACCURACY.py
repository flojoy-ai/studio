from typing import Optional

from flojoy import DataFrame, flojoy


@flojoy
def ACCURACY(
    true_data: DataFrame,
    predicted_data: DataFrame,
    true_label: Optional[str] = None,
    predicted_label: Optional[str] = None,
) -> DataFrame:
    """Take two dataframes with the true and predicted labels from a classification task, and indicates whether the prediction was correct or not.

    These dataframes should both be single columns.

    Parameters
    ----------
    true_label : optional str
        true label users can select from original data
    predicted_label : optional str
        resulting predicted label users can select

    Returns
    -------
    DataFrame
        The input predictions dataframe, with an extra boolean column "prediction_correct".
    """

    true_df = true_data.m
    predicted_df = predicted_data.m

    # if users prov
    if true_label:
        true_label = true_df[true_label]
    else:
        true_label = true_df.iloc[:, 0]

    if predicted_label:
        predicted_label = predicted_df[predicted_label]
    else:
        predicted_label = predicted_df.iloc[:, 0]

    predicted_df["prediction_correct"] = true_label == predicted_label

    return DataFrame(df=predicted_df)
