---
title: Connect Flojoy Cloud to Zapier
description: Connecting Quickbase forms to Flojoy Cloud through Zapier
sidebar:
  order: 3
  badge:
    text: New
    variant: tip
---

Video format of this tutorial:
[![Connect Quickbase forms to Flojoy Cloud through Zapier](http://img.youtube.com/vi/vKTddxV0E9c/0.jpg)](http://www.youtube.com/watch?v=vKTddxV0E9c "Connect Quickbase forms to Flojoy Cloud through Zapier")

Flojoy Cloud is the easiest way to supercharge your test & measurement data with powerful data visualizations, collaboration, and easy to use APIs for Python, LabVIEW, and MATLAB.

You can use our public Flojoy Cloud instance for your test and measurement data here: https://cloud.flojoy.ai

## Prerequisites

- [Flojoy Cloud account](https://cloud.flojoy.ai)
- [Zapier account](https://zapier.com)
- [Quickbase account](https://www.quickbase.com)

:::note
These steps can be generalized for form services (other than Quickbase) such as Google Forms, Typeform, Formspree, etc.
:::

## Steps

### In Flojoy Cloud

- Create a Flojoy Cloud account if you haven't
- Create a `Workspace` inside Flojoy Cloud
- Create a `Project` inside that workspace (you may have to create a hardware model)

![image](https://res.cloudinary.com/dhopxs1y3/image/upload/v1708023221/flojoy-docs/flojoy-cloud/zap/create-project.png)

- Create a `Test` inside that project

![image](https://res.cloudinary.com/dhopxs1y3/image/upload/v1708023221/flojoy-docs/flojoy-cloud/zap/create-test.png)

### In Zapier

- On your Zapier dashboard, create a new Zap

![image](https://res.cloudinary.com/dhopxs1y3/image/upload/v1708023220/flojoy-docs/flojoy-cloud/zap/create-zap.png)

- Use Quickbase as the trigger

![image](https://res.cloudinary.com/dhopxs1y3/image/upload/v1708023219/flojoy-docs/flojoy-cloud/zap/change-trigger.png)

- Select your Quickbase app & table you want to create a measurement from.
- Select your hardware measurement and the datatype

![image](https://res.cloudinary.com/dhopxs1y3/image/upload/v1708023219/flojoy-docs/flojoy-cloud/zap/measurement-datatype.png)

- Test your trigger

![image](https://res.cloudinary.com/dhopxs1y3/image/upload/v1708023228/flojoy-docs/flojoy-cloud/zap/test-zap.png)

- Select the Zap `Action` as `Flojoy Cloud`

![image](https://res.cloudinary.com/dhopxs1y3/image/upload/v1708023227/flojoy-docs/flojoy-cloud/zap/change-action.png)

- Select as the event `Create a new measurement` and sign in to `Flojoy Cloud` in the Zap

![image](https://res.cloudinary.com/dhopxs1y3/image/upload/v1708023226/flojoy-docs/flojoy-cloud/zap/action-signin.png)

- Choose your `Workspace` as you're signing in

![image](https://res.cloudinary.com/dhopxs1y3/image/upload/v1708023225/flojoy-docs/flojoy-cloud/zap/choose-workspace.png)

- Fill all the fields in the Zap Action

![image](https://res.cloudinary.com/dhopxs1y3/image/upload/v1708023224/flojoy-docs/flojoy-cloud/zap/fill-table.png)

- Send a test with Zapier and ensure the results appear under the approriate `Flojoy Cloud` test

![image](https://res.cloudinary.com/dhopxs1y3/image/upload/v1708023223/flojoy-docs/flojoy-cloud/zap/check-test.png)

- Publish the Zap on Zapier

### In Quickbase

- Go to your Quickbase app and save a new Table to test the Zap's Trigger

![image](https://res.cloudinary.com/dhopxs1y3/image/upload/v1708023222/flojoy-docs/flojoy-cloud/zap/test-quickbase.png)

Having issues with deployment? Join our [Discord Community](https://discord.gg/7HEBr7yG8c) and we will help you out!
