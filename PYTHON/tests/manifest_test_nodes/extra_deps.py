import numpy as np
from flojoy import flojoy, Matrix, DataFrame, Image
import tensorflow as tf


@flojoy(deps={"tensorflow": "2.12.0"}, node_type="TEST_TYPE")
def EXTRA_DEPS(mat: Matrix, data: DataFrame) -> Image:
    a = np.array([])
    return Image(r=a, g=a, b=a, a=a)
