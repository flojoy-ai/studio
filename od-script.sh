#!/bin/bash

CWD="$PWD"

FILE=$PWD/PYTHON/utils/object_detection/yolov3.weights
if test -f "$FILE"; then
   echo "$FILE exists."
else
   touch $PWD/PYTHON/utils/object_detection/yolov3.weights
   wget -O $PWD/PYTHON/utils/object_detection/yolov3.weights https://pjreddie.com/media/files/yolov3.weights
   echo "Target weight file downloaded and set to $FILE"
fi 
