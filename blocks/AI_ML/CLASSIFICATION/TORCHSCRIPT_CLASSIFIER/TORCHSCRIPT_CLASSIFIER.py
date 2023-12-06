from flojoy import DataFrame, Image, flojoy


@flojoy(
    deps={
        "torch": "2.0.1",
        "torchvision": "0.15.2",
    }
)
def TORCHSCRIPT_CLASSIFIER(
    input_image: Image, class_names: DataFrame, model_path: str
) -> DataFrame:
    """Execute a TorchScript classifier against an input image.

    Parameters
    ----------
    input_image : Image
        The image to classify.
    class_names : DataFrame
        A dataframe containing the class names.
    model_path : str
        The path to the torchscript model.

    Returns
    -------
    DataFrame
        A dataframe containing the class name and confidence score.
    """

    import numpy as np
    import pandas as pd
    import PIL.Image
    import torch
    import torchvision

    # Load model
    model = torch.jit.load(model_path)
    channels = [input_image.r, input_image.g, input_image.b]
    mode = "RGB"

    if input_image.a is not None:
        channels.append(input_image.a)
        mode += "A"

    input_image_pil = PIL.Image.fromarray(
        np.stack(channels).transpose(1, 2, 0), mode=mode
    ).convert("RGB")
    input_tensor = torchvision.transforms.functional.to_tensor(
        input_image_pil
    ).unsqueeze(0)

    # Run model
    with torch.inference_mode():
        output = model(input_tensor)

    # Get class name and confidence score
    _, pred = torch.max(output, 1)
    class_name = class_names.m.iloc[pred.item()].item()
    confidence = torch.nn.functional.softmax(output, dim=1)[0][pred.item()].item()

    return DataFrame(
        df=pd.DataFrame({"class_name": [class_name], "confidence": [confidence]})
    )
