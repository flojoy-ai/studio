from typing import Literal, Optional

from flojoy import DataContainer, flojoy


@flojoy(node_type="TEST_TYPE")
def SELECTS(
    default: DataContainer,
    option1: Literal["a", "b", "c"] = "a",
    option2: Optional[Literal["d", "e", "f"]] = None,
    option3: Literal[1, 2, 3] = 3,
) -> DataContainer:
    return default
