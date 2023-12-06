from flojoy import Image, flojoy


@flojoy(deps={"torch": "2.0.1", "torchvision": "0.15.2"})
def DEEPLAB_V3(default: Image) -> Image:
    """Return a segmentation mask from an input image.

    The input image is expected to be a DataContainer of an 'image' type.

    The output is a DataContainer of an 'image' type with the same dimensions as the input image, but with the red, green, and blue channels replaced with the segmentation mask.

    Parameters
    ----------
    default : Image
        The input image to be segmented.

    Returns
    -------
    Image
        The segmented image.
    """

    import os

    import numpy as np
    import PIL.Image
    import torch
    import torchvision.transforms.functional as TF
    from flojoy import Image
    from flojoy.utils import FLOJOY_CACHE_DIR
    from torchvision import transforms

    # Parse input image
    input_image = default
    r, g, b, a = input_image.r, input_image.g, input_image.b, input_image.a
    nparray = (
        np.stack((r, g, b, a), axis=2) if a is not None else np.stack((r, g, b), axis=2)
    )
    # Convert input image
    input_image = TF.to_pil_image(nparray).convert("RGB")
    # Set torch hub cache directory
    torch.hub.set_dir(os.path.join(FLOJOY_CACHE_DIR, "cache", "torch_hub"))
    model = torch.hub.load(
        "pytorch/vision:v0.15.2",
        "deeplabv3_resnet50",
        pretrained=True,
        skip_validation=True,
    )
    model.eval()
    # Preprocessing
    preprocess_transform = transforms.Compose(
        [
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
        ]
    )
    # Feed the input image to the model
    input_tensor = preprocess_transform(input_image)
    input_batch = input_tensor.unsqueeze(0)
    with torch.inference_mode():
        output = model(input_batch)["out"][0]
    # Fetch the output
    output_predictions = output.argmax(0)
    palette = torch.tensor([2**25 - 1, 2**15 - 1, 2**21 - 1])
    colors = torch.as_tensor([i for i in range(21)])[:, None] * palette
    colors = (colors % 255).numpy().astype("uint8")
    # plot the semantic segmentation predictions of 21 classes in each color
    r = PIL.Image.fromarray(output_predictions.byte().cpu().numpy()).resize(
        input_image.size
    )
    r.putpalette(colors)
    out_img = np.array(r.convert("RGB"))
    # Build the output image
    return Image(
        r=out_img[:, :, 0],
        g=out_img[:, :, 1],
        b=out_img[:, :, 2],
        a=None,
    )
