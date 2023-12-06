import pandas as pd


def test_ONE_HOT_ENCODING(mock_flojoy_decorator):
    from flojoy import DataFrame
    import ONE_HOT_ENCODING

    # Test the function with a dataframe containing columns object and category
    data = pd.DataFrame(
        {
            "color": ["red", "green", "blue", "red", "green", "blue"],
        }
    )
    expected_df = pd.DataFrame(
        {
            "color_blue": [False, False, True, False, False, True],
            "color_green": [False, True, False, False, True, False],
            "color_red": [True, False, False, True, False, False],
        }
    )

    out_df = ONE_HOT_ENCODING.ONE_HOT_ENCODING(data=DataFrame(data))
    pd.testing.assert_frame_equal(out_df.m, expected_df)
