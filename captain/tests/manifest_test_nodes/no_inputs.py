from flojoy import DataContainer, flojoy


@flojoy
def NO_INPUTS(foo: list[int], bar: str) -> DataContainer:
    return DataContainer()
