## The SCIKIT_LEARN_DATASET app

The workflow of this app is described below:

[SCIKIT_LEARN_DATASET](https://github.com/flojoy-io/nodes/blob/main/GENERATORS/SAMPLE_DATASET/SCIKIT_LEARN_DATASET/SCIKIT_LEARN_DATASET.py) : This is a SCIKIT_LEARN_DATASET node. It takes one parameter `dataset_name`, the name of dataset to load from [`sklearn.datasets`](https://scikit-learn.org/stable/datasets/toy_dataset.html) package. In this case it is 'iris' which is default value of this parameter. It passing a `DataFrame` object of `DataContainer` class to the next node `Table`.

[TABLE](https://github.com/flojoy-io/nodes/blob/main/VISUALIZERS/PLOTLY/TABLE/TABLE.py): This node creates a Plotly table visualization for a given input `DataFrame` object of `DataContainer` class.
