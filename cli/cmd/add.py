import os
from pathlib import Path

from rich import print

from cli.constants import BLOCK_TEMPLATE


def add(block_path: Path):
    # TODO: Update the add command once everything else is done

    print(block_path)
    # first we verify if the block name is valid
    block_name = os.path.basename(block_path)

    # lastly we finish with the python block code
    os.makedirs(block_path, exist_ok=True)

    with open(os.path.join(block_path, f"{block_name}.py"), "w+") as f:
        f.write(BLOCK_TEMPLATE.format(block_name=block_name))

    with open(os.path.join(block_path, "example.md"), "w+") as f:
        f.write("Placeholder for the example app's description")

    print(f"Done! Your Flojoy Block is ready at '{block_path}'")
