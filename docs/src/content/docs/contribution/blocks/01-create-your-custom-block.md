---
title: Create a Flojoy Block
description: Create your own Flojoy Block using Python.
slug: "contribution/blocks/custom-flojoy-block"
sidebar:
  order: 1
---

## A basic example

In this tutorial we will create a block that divides two items element-wise (for the case of vector inputs, for instance). Although we could do this with the built-in `invert` and `multiply` blocks, we will do it from scratch.

### Creating the custom block `DIVIDE`

To start, we create a `custom-blocks` folder. You can name it as you wish. We will put our all custom blocks in this folder so that we can import them together.

Now, we create a `DIVIDE` folder inside `custom-blocks` folder. Inside the `DIVIDE` folder, create a new Python file with the same name as the folder, `DIVIDE.py`.

:::note
Each block should have its own folder. The name of the folder, file and block function should be the same and in uppercase. We use this convention to allow the blocks to be automatically loaded into Flojoy Studio.

:::

We can then create our `DIVIDE` function as follows:

```python {title='DIVIDE.py'}
import numpy as np
from flojoy import flojoy, OrderedPair

@flojoy
def DIVIDE(a: OrderedPair, b: OrderedPair) -> OrderedPair:
    x = a.x
    result = np.divide(a.y,b.y)
    return OrderedPair(x=x, y=result)
```

:::note
The type hints are important! This is how Flojoy differentiates between block inputs (that you connect the edges to) and parameters (that you can set in the block parameters panel). Anything that inherits from `DataContainer` (e.g. `OrderedPair`, `Matrix`, etc.) is an _input_, and everything else is a _parameter_.
:::

## A more advanced example

Let's say we want to create a block to wrap the `train_test_split` function from `scikit-learn`. This block will have to return two different `DataContainers`.

We start by creating a new folder inside the `custom-blocks` directory called `TRAIN_TEST_SPLIT`, and a Python file inside the `TRAIN_TEST_SPLIT` folder with the same name: `TRAIN_TEST_SPLIT.py`. Then we put the following code in the file:

```python {title="TRAIN_TEST_SPLIT.py"}

from typing import TypedDict
from flojoy import flojoy, DataFrame
from sklearn.model_selection import train_test_split


class TrainTestSplitOutput(TypedDict):
    train: DataFrame
    test: DataFrame

@flojoy(deps={"scikit-learn": "1.2.2"})
def TRAIN_TEST_SPLIT(
    default: DataFrame, test_size: float = 0.2
) -> TrainTestSplitOutput:
    df = default.m

    train, test = cast(list[pd.DataFrame], train_test_split(df, test_size))
    return TrainTestSplitOutput(train=DataFrame(df=train), test=DataFrame(df=test))
```

In this example, the block needs to import `sklearn`, which might not be installed. We can specify this in the `deps` argument to the `flojoy` decorator. This will ensure that the library is installed before the block is run.

This block needs to return two `DataContainers`. We do this by creating a `TypedDict` class with the names of the outputs as fields. Then, we return an instance of this class.

Looking at the parameters, we have one `DataContainer` input, called `default`. When we only have one input and we do not want to label it in the Front-End, we can name it `default`, which is a special name that Flojoy recognizes. This block also has a `test_size` parameter that has a default value of 0.2.

### Importing custom block in Flojoy

There are few steps to import your custom blocks to Flojoy:

1. First click on `Add block` button from top left of the Flojoy studio app. It will expand a side bar.

2. Click on `Custom` tab from the blocks sidebar. Here you'll find a button named `Import custom blocks`.

3. Click on `Import custom blocks` button. It'll open a file window.

4. Now head to your directory where you have created your custom block and select it. In this case that folder is `custom-blocks`.

Congratulations! you just imported your custom block to Flojoy. You should see your custom block in the sidebar. Click on the block to add it to flow chart.

:::note
Every time you create a new block, Studio will hot reload to include it in the sidebar under the `Custom` tab. Any changes to custom blocks are immediately reflected in Studio, no reload is required.
:::

:::note
You can use the same sections as the standard library if you want blocks to have the same icons/colors. For example, you can create blocks under a `HARDWARE` folder inside your custom blocks directory to make them look like hardware blocks.
:::

## Contributing to Flojoy standard blocks

### Use Flojoy CLI tool to create a new block

If you have cloned Flojoy source code to your local machine then you can use our CLI to generate the boilerplate code for a new Flojoy block.

First, we recommend you to have [just](https://just.systems/) installed, this
allows you to type `just add BLOCK_NAME` anywhere in the blocks repository,
instead of typing out the full command (`poetry run fjblocks.py add BLOCK_NAME`)

Once you have **just** installed, head to anywhere in the blocks folder and
run `just add BLOCK_NAME`.

For example, if I am in the `blocks/AI_ML/CLASSIFICATION/` folder, I can run
`just add MY_NEW_ML_BLOCK` and my new block will be located at
`blocks/AI_ML/CLASSIFICATION/MY_NEW_ML_BLOCK/MY_NEW_ML_BLOCK.py`.

### Before you push to Github

Here is a quick checklist to make sure everything is good before you make a PR.

1. Make sure the block functions properly, and write a comprehensive docstring
   describing what it does.
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
