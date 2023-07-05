from flojoy import flojoy, DataContainer


@flojoy(node_type="default")
def DEFAULT_NODE(default: DataContainer) -> DataContainer:
    return DataContainer(x=[2], y=[2])
