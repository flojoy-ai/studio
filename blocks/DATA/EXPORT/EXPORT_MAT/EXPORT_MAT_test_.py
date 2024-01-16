import numpy as np
from flojoy import DataFrame, Directory
import pandas as pd
import os
import scipy


def test_EXPORT_MAT_dataframe(mock_flojoy_decorator):
    import EXPORT_MAT

    m = 10
    data = {
        'IntegerColumn': np.random.randint(1, 100, size=m),
        'FloatColumn': np.random.rand(m),
        'StringColumn': [chr(np.random.randint(97, 123)) for _ in range(m)]
    }

    df = DataFrame(pd.DataFrame(data))
    directory = os.path.expanduser("~")
    
    EXPORT_MAT.EXPORT_MAT(
        dc=df,
        dir=Directory(directory),
        filename="testmatfile",
        format="5",
        long_field_names=False,
        do_compression=False,
    )

    try:
        file_path = os.path.join(directory, "testmatfile.mat")
        assert os.path.exists(file_path), f"File '{file_path}' does not exist. The export to .mat failed."

    finally:
        # Clean up: Remove the test file
        if os.path.exists(file_path):
            mat = scipy.io.loadmat(file_path)
            assert 'IntegerColumn' in mat, "Column was not saved"
            assert data['IntegerColumn'][1] in mat['IntegerColumn'][0], "Data was not saved"
            os.remove(file_path)

