import numpy as np
import pandas as pd
import torch
import torchvision.transforms.functional as TF
import transformers
from flojoy import DataFrame, Image, flojoy, snapshot_download


@flojoy(deps={"torch": "2.0.1", "torchvision": "0.15.2", "transformers": "4.30.2"})
def NLP_CONNECT_VIT_GPT2(default: Image) -> DataFrame:
    """The NLP_CONNECT_VIT_GPT2 node captions an input image and produces an output string wrapped in a dataframe.

    Parameters
    ----------
    default : Image
        The image to caption.

    Returns
    -------
    DataFrame
        DataFrame containing the caption column and a single row.
    """

    r, g, b, a = default.r, default.g, default.b, default.a
    nparray = (
        np.stack((r, g, b, a), axis=2) if a is not None else np.stack((r, g, b), axis=2)
    )
    image = TF.to_pil_image(nparray).convert("RGB")

    # Download repo to local flojoy cache
    local_repo_path = snapshot_download(
        repo_id="nlpconnect/vit-gpt2-image-captioning",
        revision="dc68f91c06a1ba6f15268e5b9c13ae7a7c514084",
        local_dir_use_symlinks=False,
    )
    # Load model objects
    model = transformers.VisionEncoderDecoderModel.from_pretrained(local_repo_path)
    feature_extractor = transformers.ViTImageProcessor.from_pretrained(local_repo_path)
    tokenizer = transformers.AutoTokenizer.from_pretrained(local_repo_path)

    with torch.inference_mode():
        pixel_values = feature_extractor(
            images=[image], return_tensors="pt"
        ).pixel_values  # type: ignore
        output_ids = model.generate(pixel_values, max_length=16, num_beams=4)  # type: ignore
        preds = tokenizer.batch_decode(output_ids, skip_special_tokens=True)  # type: ignore
        pred = preds[0].strip()

    df_pred = pd.DataFrame.from_records([(pred,)], columns=["caption"])

    return DataFrame(df=df_pred)
