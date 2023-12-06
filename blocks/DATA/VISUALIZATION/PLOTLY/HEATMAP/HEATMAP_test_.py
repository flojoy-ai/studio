from plotly.express import data
from flojoy import Plotly, Vector, OrderedPair, DataFrame
import numpy as np


# Tests that the function returns the expected Plotly object when called with allowed type of data
def test_default_dataset_key(mock_flojoy_decorator):
    import HEATMAP

    v = Vector(v=np.array([1, 2, 3, 4]))
    ordered_pair = OrderedPair(x=np.array([1, 2, 3, 4]), y=np.array([1, 2, 3, 4]))
    df = DataFrame(df=data.iris())
    data_list = [v, ordered_pair, df]
    for data_ in data_list:
        result = HEATMAP.HEATMAP(data_)
        assert isinstance(result, Plotly)
