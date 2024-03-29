import numpy as np
from flojoy import DataFrame, Image, Matrix, flojoy


@flojoy(deps={"tensorflow": "2.12.0", "torch": "2.0.1"}, node_type="TEST_TYPE")
def EXTRA_DEPS(mat: Matrix, data: DataFrame) -> Image:
    a = np.array([])
    return Image(r=a, g=a, b=a, a=a)
