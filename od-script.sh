#!/bin/bash

CWD="$PWD"

# FILE=$PWD/PYTHON/utils/object_detection/yolov3/yolov3.weights
FILE=$PWD/PYTHON/utils/object_detection/yolov8/yolov8n.pt
if test -f "$FILE"; then
   echo "$FILE exists."
else
   # touch $PWD/PYTHON/utils/object_detection/yolov3/yolov3.weights
   # wget -O $PWD/PYTHON/utils/object_detection/yolov3/yolov3.weights https://pjreddie.com/media/files/yolov3.weights
   touch $PWD/PYTHON/utils/object_detection/yolov8/yolov8n.pt
   wget -O $PWD/PYTHON/utils/object_detection/yolov8/yolov8n.pt https://github.com/ultralytics/assets/releases/download/v0.0.0/yolov8n.pt
   echo "Target weight file downloaded and set to $FILE"
fi 
