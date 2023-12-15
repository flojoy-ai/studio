---
title: Interface Introduction
sidebar:
  order: 3
---

This is a guide of the Flojoy Studio interface. When you first launch Flojoy you should see the following pop-up:

![image](https://res.cloudinary.com/dhopxs1y3/image/upload/v1702316546/flojoy-docs/intro-and-guide/launch_ui.png)

Here you can choose to either close the pop-up or load an existing app. You can also see the current versino of Flojoy (0.1.24 here which is likely different for you). For now, click `Try out Flojoy Studio` to close the pop-up. After the pop-up is closed you can see the home interface of Flojoy which is the interface where apps are created.

![image](https://res.cloudinary.com/dhopxs1y3/image/upload/v1702315082/flojoy-docs/intro-and-guide/intro-UI.png)

You can also see the default app which is made from 7 _Blocks_. In the [next tutorial](/studio/app-creation/), we will go over how to create this default app. For now we will go over the basics of the Flojoy interface.

## The Layout of the Interface

:::note
Flojoy may look slightly different on different operating systems. Additionally, different versions of Flojoy will probably look different.
:::

### Center

First, and possibly most important, the center of the Flojoy app shows the visual script (or app) that is currently loaded. You can:

- drag around your view by clicking and moving your cursor
- zoom using the mouse/trackpad scrolling
- select Blocks and connections by clicking on them
- delete selected blocks by pressing backspace/delete
- right click on the blocks to see various options
- resize certain blocks (such as `LINE` and other plots)

### Top Right

The top right of the app has controls for this app.

![image](https://res.cloudinary.com/dhopxs1y3/image/upload/v1702315082/flojoy-docs/intro-and-guide/top-right-ui.png)

- The `PLAY` button runs the current app (and will show `CANCEL` when the app is running).
- The `Clear Canvas` button clears the current app by deleting all the blocks.
- `File` opens a drop down menu which contains buttons to save or load apps.
- `Settings` opens a drop down menu which contains various settings (some are for advanced users or development). One useful control here is `Check for Studio updates`.
- `Feedback` opens a pop-up menu allowing the user to contact us with feedback and requests.
- The `Watch Mode` switch turns off watch mode which, when turned on, runs the app everytime a Block parameter is changed.
- Lastly, the moon button beside `Feedback` changes the color scheme to light mode. Note the button also changes to a sun for turning back to dark mode.

![image](https://res.cloudinary.com/dhopxs1y3/image/upload/v1702315082/flojoy-docs/intro-and-guide/bright-mode-ui.png)

### Top Middle

The top middle of Flojoy contains the current version number as well as a status indicator.

![image](https://res.cloudinary.com/dhopxs1y3/image/upload/v1702315082/flojoy-docs/intro-and-guide/top-middle-ui.png)

### Top Left

More controls can be found in the top left of Flojoy.

![image](https://res.cloudinary.com/dhopxs1y3/image/upload/v1702315082/flojoy-docs/intro-and-guide/top-left-ui.png)

- Here, the project name is `Untitled project`. This controls the default app name when you use `Save As` under `File` (the default is _app_).
- `VISUAL PYTHON SCRIPT` and `HARDWARE DEVICES` are the two current tabs available in Flojoy. The `VISUAL PYTHON SCRIPT` tab is the default tab where the app is shown.
- The `HARDWARE DEVICES` tab is for controlling and debugging hardware connections (this will be covered in a later tutorial). The blue underscore shows the current tab.
- `Add Blocks` allows you to add blocks to the current app. Use the search function at the top of the pop-up menu to more easily find apps.
- `Add Text` adds a resizable text block where you can type custom text.
- `App Gallery` opens a pop-up menu containing various default apps.

### Bottom Left

The bottom left contains visual controls and the minimized log

![image](https://res.cloudinary.com/dhopxs1y3/image/upload/v1702315082/flojoy-docs/intro-and-guide/bottom-left-ui.png)

The 4 buttons on the left are:

- Plus and minus buttons for zooming in and out respectively.
- The square button for centering the app in the screen. This is useful if you ever lose track on the app off screen.
- The lock for locking the Blocks positions and connections.

Additionally, you can see one line on the log in the bottom of the screen. This log contains important debugging information if there's ever an issue.

The log can be expanded using the `Expand log` button in the bottom right of Flojoy.

### Bottom Right

![image](https://res.cloudinary.com/dhopxs1y3/image/upload/v1702315082/flojoy-docs/intro-and-guide/bottom-right-ui.png)

The bottom right also contains an indicator showing the current view and Block locations. The black box shows the current view and the small grey boxes show where the Blocks are inside of that view (or outside of it).
