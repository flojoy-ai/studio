from flojoy import flojoy, Vector
from flojoy.utils import FLOJOY_CACHE_DIR


@flojoy(
    deps={
        "onnxruntime": None,
        "onnx": None,
    }
)
def ONNX_MODEL(
    file_path: str,
    default: Vector,
) -> Vector:
    """Load a serialized ONNX model and uses it to make predictions using ONNX Runtime.

    This allows supporting a wide range of deep learning frameworks and hardware platforms.

    Notes
    -----

    On the one hand, ONNX is an open format to represent deep learning models.
    ONNX defines a common set of operators - the building blocks of machine learning
    and deep learning models - and a common file format to enable AI developers
    to use models with a variety of frameworks, tools, runtimes, and compilers.

    See: https://onnx.ai/

    On the other hand, ONNX Runtime is a high-performance inference engine for machine
    learning models in the ONNX format. ONNX Runtime has proved to considerably increase
    performance in inferencing for a broad range of ML models and hardware platforms.

    See: https://onnxruntime.ai/docs/

    Moreover, the ONNX Model Zoo is a collection of pre-trained models for common
    machine learning tasks. The models are stored in ONNX format and are ready to use
    in different inference scenarios.

    See: https://github.com/onnx/models

    Parameters
    ----------
    file_path : str
        Path to a ONNX model to load and use for prediction.

    default : Vector
        The input tensor to use for prediction.
        For now, only a single input tensor is supported.
        Note that the input tensor shape is not checked against the model's input shape.

    Returns
    -------
    Vector:
        The predictions made by the ONNX model.
        For now, only a single output tensor is supported.
    """

    import os
    import onnx
    import urllib.request
    import numpy as np
    import onnxruntime as rt

    model_name = os.path.basename(file_path)

    if file_path.startswith("http://") or file_path.startswith("https://"):
        # Downloading the ONNX model from a URL to FLOJOY_CACHE_DIR.
        onnx_model_zoo_cache = os.path.join(
            FLOJOY_CACHE_DIR, "cache", "onnx", "model_zoo"
        )

        os.makedirs(onnx_model_zoo_cache, exist_ok=True)

        filename = os.path.join(onnx_model_zoo_cache, model_name)

        urllib.request.urlretrieve(
            url=file_path,
            filename=filename,
        )

        # Using the downloaded file.
        file_path = filename

    # Pre-loading the serialized model to validate whether is well-formed or not.
    model = onnx.load(file_path)
    onnx.checker.check_model(model)

    # Using ONNX runtime for the ONNX model to make predictions.
    sess = rt.InferenceSession(file_path, providers=["CPUExecutionProvider"])

    # TODO(jjerphan): Assuming a single input and a single output for now.
    input_name = sess.get_inputs()[0].name
    label_name = sess.get_outputs()[0].name

    # TODO(jjerphan): For now NumPy is assumed to be the main backend for Flojoy.
    # We might adapt it in the future so that we can use other backends
    # for tensor libraries for application using Deep Learning libraries.
    input_tensor = np.asarray(default.v, dtype=np.float32)
    predictions = sess.run([label_name], {input_name: input_tensor})[0]

    return Vector(v=predictions)
