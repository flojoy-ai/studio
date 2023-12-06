---
title: Flojoy Blocks Section
slug: "contribution/docs/section-guide"
sidebar:
  order: 1
---

Looking to add/update the docs page for the Flojoy Block you made? Here is a simple
breakdown of the repo structure and the steps you need to take.

All the Flojoy Blocks documentation is located in the `docs/src/content/docs/blocks/`
of [this repo](https://github.com/flojoy-ai/blocks). **Note that in this
directory, all the files except `overview.md` are auto-generated, and nobody
should edit them manually.**

If you wish to edit the overview page for one of the block categories, you can
edit the `overview.md` file directly.

However, if you are trying to add a doc page for the block you made, or edit the
doc page for a specific block, you must do that in the `blocks/` directory. You
can find more instructions below.

## Contribution Guide

**TLDR: Just update whatever file in your block's folder (within the `blocks/` directory)
and run `poetry run python3 fjblock.py sync` or `just sync`
(need to have [just](https://github.com/casey/just) installed) to
auto generate the docs.**

Each block's documentation page is made of the following components:

### 1. A prettified docstring display for this block

To update this component, you need to add/update the docstring on the block's Python
code itself, and then run `poetry run python3 fjblock.py sync` to regenerate the
docs page. This will auto regenerate the docstring for you.

IMPORTANT: Please refer to our [docstring style guide](/contribution/blocks/docstring-styleguide/)
to create a valid docstring :)

Example: the [docstring](https://github.com/flojoy-ai/blocks/blob/main/blocks/AI_ML/CLASSIFICATION/ACCURACY/ACCURACY.py)
for the `ACCURACY` block.

### 2. The Python source code for the block

Same as point above, just edit the block's Python code directly and run
`poetry run python3 fjblock.py sync`.

Example: the [source code](https://github.com/flojoy-ai/blocks/blob/main/blocks/AI_ML/CLASSIFICATION/ACCURACY/ACCURACY.py)
for the `ACCURACY` block.

### 3. An example Flojoy app using this block

To add/update the example app, you will have to add an `app.json` file which
sits in the same folder at the block's Python code. Or simply update the
existing `app.json` file to be your updated Flojoy app. You do not need to run
the sync command in this case.

Example: the [app.json](https://github.com/flojoy-ai/blocks/blob/main/blocks/AI_ML/CLASSIFICATION/ACCURACY/app.json)
for the `ACCURACY` block.

### 4. A breakdown of this example app

Same idea as before, you can add an `example.md` file in the same folder as the
block's Python code. Or simply update the existing `example.md` file. Run
`poetry run python3 fjblock.py sync` once you are done!

Example: the [example.md](https://github.com/flojoy-ai/blocks/blob/main/blocks/AI_ML/CLASSIFICATION/ACCURACY/example.md)
for the `ACCURACY` block.

Note: If you encounter any error while running the sync command, don't panic!
The error should be very self explanatory and you should treat the error message
as your best friend when debugging. Still having trouble? Post your question in
our [community Discord server](https://discord.gg/7HEBr7yG8c) and we will help
you out!

Happy contributing, we cannot wait to see the Flojoy Block you made!
