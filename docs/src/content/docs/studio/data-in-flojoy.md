---
title: Data in Flojoy
sidebar:
  order: 6
---

In this tutorial, we'll go further into the workings of Flojoy. Specifically we'll discuss how Flojoy handles data.

## Data in Flojoy

### Input

Let's start off with the default App you see on startup. Scroll over the input connection of the `SINE` Block.

![image](https://res.cloudinary.com/dhopxs1y3/image/upload/v1702315082/flojoy-docs/intro-and-guide/block-input.png)

A window should automatically popup showing you information what this Block expects to be input.

- ***Default*** - the name of the input
- ***OrderedPair*** and ***Vector*** the data types the Block can take.
- The bottom is a description of what the input is used for. Here, it defines the x-axis of the output data.

### Output

Next, scroll over the output connection of the `SINE` Block.

![image](https://res.cloudinary.com/dhopxs1y3/image/upload/v1702315082/flojoy-docs/intro-and-guide/block-output.png)

Similar to the input, you can see a summary of the output data. Similar to the input, ***OrderedPair*** is present, but ***Vector*** is missing. This is because the Block can only output one data type.

### DataContainers

Now let's stop and talk about data types in Flojoy. Data in Flojoy is currently passed from Block to Block in `DataContainers`. Here are a few types of `DataContainers` (not all) and what they are used for.

- `OrderedPair` - x and y data with the same length/number of points. Classic use example of distance (y) vs time (x).
- `Vector` - Similar to OrderedPair but with 1 axis. Can be used for x or y axis seperately.
- `Scalar` - A single value such as `2` or `3.14`.
- `Image` - RGB or RGBA data. Used for image data.
- `Matrix` - A 2-dimensional matrix. Can be used for matrix math.

See [Contributing]("/contribution/blocks/custom-flojoy-block/") for more information on `DataContainer` types in Flojoy. To connect the import and output of two Blocks, they must have at least one matching type. If there is no matching type, an error like this will appear:

![image](https://res.cloudinary.com/dhopxs1y3/image/upload/v1702315082/flojoy-docs/intro-and-guide/type-match-errors.png)

when connecting a Block outputing a `Scalar` to a Block expecting either `OrderedPair` or `Vector` as input (OrderedPair|Vector where | is short for 'or').

### Flow Control

Note that not all inputs have a required data type for the input. Scroll over the input for the `RAND` Block:

![image](https://res.cloudinary.com/dhopxs1y3/image/upload/v1702315082/flojoy-docs/intro-and-guide/any-input-blocks.png)

the data type specified here is ***Any***. However, also see that the description says the input is unused. In this case the input is not for data, instead it's for runtime or flow control. We'll go into this subject more in the next tutorial.
