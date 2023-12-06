---
title: Create a Flojoy Block
description: Create your own Flojoy Block using Python.
slug: "contribution/blocks/custom-flojoy-block"
sidebar:
  order: 1
---

## Getting Started!

To create a new Flojoy Block, you can use our CLI to generate the boilerplate
code for you!

First, we recommend you to have [just](https://just.systems/) installed, this
allows you to type `just add BLOCK_NAME` anywhere in the blocks repository,
instead of typing out the full command (`poetry run fjblocks.py add BLOCK_NAME`)

Once you have **just** installed, head to anywhere in the blocks folder and
run `just add BLOCK_NAME`.

For example, if I am in the `blocks/AI_ML/CLASSIFICATION/` folder, I can run
`just add MY_NEW_ML_BLOCK` and my new block will be located at
`blocks/AI_ML/CLASSIFICATION/MY_NEW_ML_BLOCK/MY_NEW_ML_BLOCK.py`.

## Contributute to Flojoy's Blocks Collection

Here is a quick checklist to make sure everything is good before you make a PR.

1. Make sure the block functions properly, and write a comprehensive docstring
   describing what it deos.
2. Double check if there is any Python errors, looking for red squiggly lines
   in your code editor!
3. We want the code format to look pretty and consistent!
   (You can do so with `poetry run ruff format .` or simply `just format`)
4. Show everyone how this block works! You should create an example app in
   `app.json` and the description for this example app in `example.md`.
5. Lastly, you can run `poetry run python3 fjblock.py sync` or `just sync` and
   make sure there is no errors.

Seems like a lot of steps! But this is how we make sure that every Flojoy Block
is comprehensive and reliable in your workflow :)
