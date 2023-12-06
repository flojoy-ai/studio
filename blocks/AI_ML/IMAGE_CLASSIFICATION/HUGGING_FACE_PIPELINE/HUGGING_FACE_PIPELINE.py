import os
from typing import Dict, List
import numpy as np
import pandas as pd
import PIL.Image as PILImage
from flojoy import DataFrame, Image, flojoy
from flojoy.utils import FLOJOY_CACHE_DIR


@flojoy(deps={"transformers": "4.30.2"})
def HUGGING_FACE_PIPELINE(
    default: Image,
    model: str = "google/vit-base-patch16-224",
    revision: str = "main",
) -> DataFrame:
    """The HUGGING_FACE_PIPELINE node uses a classification pipeline to process and classify an image.

    For more information about Vision Transformers,
    see: https://huggingface.co/google/vit-base-patch16-224

    For a complete list of models, see:
    https://huggingface.co/models?pipeline_tag=image-classification

    For examples of how revision parameters (such as 'main') is used,
    see: https://huggingface.co/google/vit-base-patch16-224/commits/main

    Parameters
    ----------
    default : Image
        The input image to be classified.
        The image must be a PIL.Image object, wrapped in a Flojoy Image object.
    model : str
        The model to be used for classification.
        If not specified, Vision Transformers (i.e. 'google/vit-base-patch16-224') are used.
    revision : str
        The revision of the model to be used for classification.
        If not specified, 'main' is used.

    Returns
    -------
    DataFrame:
        A DataFrame containing the columns 'label' (as classification label)
        and 'score' (as the confidence score).
        All scores are between 0 and 1, and sum to 1.
    """

    # Setting transformers cache directory to flojoy cache directory before importing transformers
    # not to pollute the user's cache directory.
    os.environ["TRANSFORMERS_CACHE"] = os.path.join(FLOJOY_CACHE_DIR, "transformers")

    from transformers import pipeline as ts_pipeline

    # Using Vision Transformer, a general purpose vision model.
    # See: https://huggingface.co/google/vit-base-patch16-224
    # Lists of revisions: https://huggingface.co/google/vit-base-patch16-224/commits/main
    # TODO: find a way to set the revision and model name as parameters.
    pipeline = ts_pipeline("image-classification", model=model, revision=revision)

    # Convert input image
    input_image = default
    r, g, b, a = input_image.r, input_image.g, input_image.b, input_image.a
    image_as_nparray = (
        np.stack((r, g, b, a), axis=2) if a is not None else np.stack((r, g, b), axis=2)
    )
    input_image = PILImage.fromarray(image_as_nparray)

    # List of dict of classification labels and confidence scores
    # See: https://huggingface.co/docs/transformers/main_classes/pipelines#transformers.ImageClassificationPipeline.example
    classification_confidence_scores: List[Dict[str, float]] = pipeline(input_image)

    df_classification_confidence_scores = DataFrame(
        pd.DataFrame(classification_confidence_scores, columns=["label", "score"])
    )
    return df_classification_confidence_scores
