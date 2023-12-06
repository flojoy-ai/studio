WARN_STRING = "[bold yellow]Warning![/bold yellow]"
ERR_STRING = "[bold red]Error![/bold red]"

BLOCKS_DOCS_FOLDER = "docs/src/content/docs/blocks/"
BLOCKS_SOURCE_FOLDER = "blocks/"

BLOCK_TEMPLATE = """\
from flojoy import flojoy, DataContainer


@flojoy
def {block_name}(
    default: DataContainer,
) -> DataContainer:
    \"\"\"A short description for the {block_name} block.

    A long description for the {block_name} block.

    Parameters
    ----------
    default: DataContainer
        The input data container.

    Returns
    -------
    DataContainer
        The output data container
    \"\"\"
    pass
"""
