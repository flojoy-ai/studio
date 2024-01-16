---
title: Flow Control
sidebar:
  order: 7
---

In this tutorial, we'll go into how App's run in Flojoy and some of the tools offered.

### Block execution order

Most use cases of Flojoy will require multiple Blocks. Therefore, it's important to know the order that the Blocks will run. In the case where one Block is connected to another, the Block on the left (with the output connected) will run first.

![image](https://res.cloudinary.com/dhopxs1y3/image/upload/v1702315082/flojoy-docs/intro-and-guide/basic-app.png)

In this example, the `BASIC_OSCILLATOR` Block will run first. Note that even if the `LINE` Block is moved to the left of the other Block, it will still run second because the connections are the deciding factor. The `LINE` plot requires the data from `BASIC_OSCILLATOR` to run.

![image](https://res.cloudinary.com/dhopxs1y3/image/upload/v1702658643/flojoy-docs/intro-and-guide/backwards-app.png)

One debugging setting you can change is **_Block Delay_** (**_Settings_** -> **_Block Settings_** -> **_Block Delay_**). Change this to _1000_ and each Block will be delayed 1 second after the last one. Then you can more clearly see the execution order (look at the top of the App). Let's look at the default app and decide what order the Blocks will run in.

![image](https://res.cloudinary.com/dhopxs1y3/image/upload/v1702315082/flojoy-docs/intro-and-guide/starting-app.png)

Obviously `LINSPACE` will run first. Next, it's not so obvious. The reality is that the `ADD` block relies on the three Blocks before it. The order that these three parallel Blocks will run is random. Next the `ADD` block will run followed by the Viz Blocks in a undetermined order.

### Flow Control

There are various Blocks for flow control available. We'll go through an example of these now. If you want to follow along please clear your canvas, add:

- 2x `RAND`
- `LOOP`
- `FEEDBACK`
- `APPEND`
- `SCATTER`
- `HISTOGRAM`

and lay them out as shown.

![image](https://res.cloudinary.com/dhopxs1y3/image/upload/v1702658643/flojoy-docs/intro-and-guide/loop-app.png)

Change the following parameters: for both `RAND` _size_ = 1, `FEEDBACK` _referred_block_ = `APPEND`, `LOOP` _num_loops_ = 100.

The app is:

1. The first `RAND` Block generates a random scalar
2. The `LOOP` Block outputs this scalar to the top right connection and:
3. Runs the Blocks connected to the loop 100 times:
   1. Inside the loop, the `FEEDBACK` Block outputs what the `APPEND` block last output
   2. The `RAND 1` Block generates a random scalar
   3. The `APPEND` Block appends the top input to the end of the bottom
      - e.g. if 2 is input to the top and a list of [1, 5, 3] is input on the bottom, the result will be [1, 5, 3, 2]

![image](https://res.cloudinary.com/dhopxs1y3/image/upload/v1702658643/flojoy-docs/intro-and-guide/loop-app-final.png)

The result is a list (AKA a **_Vector_**) of random values that grows by 1 after every loop.

Try it yourself to see it in action (try changing the number of loops).

A couple of things to note:

- Note that during the first loop, `APPEND` has not yet output anything. In this case, `FEEDBACK` will instead pass through the input, unchanged, as its output. This is the reason for the first `RAND` Block.
- If you set _num_loops_ for `LOOP` to -1, the loop will continue indefinitely, unless cancelled.
