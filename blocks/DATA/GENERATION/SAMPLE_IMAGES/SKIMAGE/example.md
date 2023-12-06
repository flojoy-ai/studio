## The SKIMAGE app

In this example, there are three nodes and the workflow of this app is described below:

[SKIMAGE](https://github.com/flojoy-io/nodes/blob/main/GENERATORS/SAMPLE_IMAGES/SKLEARN_IMAGE/SKIMAGE.py) : This is a SK Learn Image node. It takes one parameter  `img_key`, the name of sample image to load from `scikit-image` package. In this case it is 'astronaut' which is default value of this parameter. It passing a DataContainer class of an image (r,g,b,a) to the next node `Object Detection`.

[OBJECT_DETECTION](https://github.com/flojoy-io/nodes/blob/main/AI_ML/OBJECT_DETECTION/OBJECT_DETECTION.py): This is Object detection node which detects objects from a given `DataContainer` class of `image` type using `opencv` python library.

[END](https://github.com/flojoy-io/nodes/blob/main/LOGIC_GATES/TERMINATORS/END.py): This node terminating the current script run. The output of this node is same as its parent node.
