---
title: WEBCAM
description: In this example, the WEBCAM node takes and returns a picture if a USB camera is connected to the computer. The IMSHOW node then displays the image taken by the camera, and the END node terminates the process.
keyword: [Python, Instrument, Web cam, Camera, Python webcam integration, Camera instrument in Python, Capture images and videos, Streamline webcam usage, Python-based camera control, Webcam integration techniques, Python image and video capture, Enhance projects with webcam, Accurate media processing, Webcam usage with Python]
image: https://raw.githubusercontent.com/flojoy-ai/docs/main/docs/nodes/INSTRUMENTS/WEB_CAM/CAMERA/examples/EX1/output.jpeg
---  

In this example app, the [`WEBCAM`](https://github.com/flojoy-io/nodes/blob/main/INSTRUMENTS/WEB_CAM/CAMERA/CAMERA.py) node takes and returns a picture from a camera connected to the computer.

The camera first has to be opened with the [`OPEN_WEBCAM`](https://github.com/flojoy-io/nodes/blob/main/INSTRUMENTS/WEB_CAM/CAMERA/CAMERA.py) node, which requires you to select which camera to use.

The [`IMSHOW`](https://github.com/flojoy-io/nodes/blob/main/VISUALIZERS/PLOTLY/TABLE/TABLE.py) node displays the image taken by the camera that was selected.
