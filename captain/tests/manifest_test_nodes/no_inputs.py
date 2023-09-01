from flojoy import flojoy, DataContainer


@flojoy
def NO_INPUTS(foo: list[int], bar: str) -> DataContainer:
    return DataContainer()
