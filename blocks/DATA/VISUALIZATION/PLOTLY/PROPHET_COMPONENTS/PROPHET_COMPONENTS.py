import os
import sys

import numpy as np
import pandas as pd
from flojoy import DataFrame, Plotly, flojoy


@flojoy(deps={"prophet": "1.1.5"})
def PROPHET_COMPONENTS(default: DataFrame, periods: int = 365) -> Plotly:
    """The PROPHET_COMPONENTS node plots the components of the prophet model trained in the PROPHET_PREDICT node.

    This is the output plotly graph from the 'plot_components_plotly' function from 'prophet.plot'.
    It expects the trained Prophet model from the PROPHET_PREDICT node as input.

    If 'run_forecast' was True in that node, the forecasted dataframe will be available as the 'm' attribute of the default input.
    Otherwise, this will make the predictions on the raw dataframe (in which case it will be the 'm' attribute of the default input).

    You can tell if that forecasted dataframe is available via the 'extra' field of data input, 'run_forecast' (data.extra["run_forecast"]).

    Inputs
    ------
    default : DataFrame
        the DataContainer to be visualized

    data : DataContainer
        the DataContainer that holds prophet model and forecast data in the 'extra' field


    Parameters
    ----------
    periods : int
        The number of periods out to predict.
        Only used if the node passed into this node (i.e. PROPHET_PREDICT) did NOT return the forecast.
        If the forecast was included in the DataContainer, this parameter will be ignored.

        Default = 365

    Returns
    -------
    Plotly
        the DataContainer containing the Plotly visualization of the prophet model
    """
    import prophet
    from prophet.plot import plot_components_plotly
    from prophet.serialize import model_from_json

    def _make_dummy_dataframe_for_prophet():
        """Generate random time series data to test if prophet works"""
        start_date = pd.Timestamp("2023-01-01")
        end_date = pd.Timestamp("2023-07-20")
        num_days = (end_date - start_date).days + 1
        timestamps = pd.date_range(start=start_date, end=end_date, freq="D")
        data = np.random.randn(num_days)  # Random data points
        df = pd.DataFrame({"ds": timestamps, "ys": data})
        df.rename(
            columns={df.columns[0]: "ds", df.columns[1]: "y"}, inplace=True
        )  # PROPHET model expects first column to be `ds` and second to be `y`
        return df

    def _apply_macos_prophet_hotfix():
        """This is a hotfix for MacOS. See https://github.com/facebook/prophet/issues/2250#issuecomment-1559516328 for more detail"""

        if sys.platform != "darwin":
            return

        # Test if prophet works (i.e. if the hotfix had already been applied)
        try:
            _dummy_df = _make_dummy_dataframe_for_prophet()
            prophet.Prophet().fit(_dummy_df)
        except RuntimeError:
            print("Could not run prophet, applying hotfix...")
        else:
            return

        prophet_dir = prophet.__path__[0]  # type: ignore
        # Get stan dir
        stan_dir = os.path.join(prophet_dir, "stan_model")
        # Find cmdstan-xxxxx dir
        cmdstan_basename = [x for x in os.listdir(stan_dir) if x.startswith("cmdstan")]
        assert len(cmdstan_basename) == 1, "Could not find cmdstan dir"
        cmdstan_basename = cmdstan_basename[0]
        # Run (from stan_dir) : install_name_tool -add_rpath @executable_path/<CMDSTAN_BASENAME>/stan/lib/stan_math/lib/tbb prophet_model.bin
        cmd = f"install_name_tool -add_rpath @executable_path/{cmdstan_basename}/stan/lib/stan_math/lib/tbb prophet_model.bin"
        cwd = os.getcwd()
        os.chdir(stan_dir)
        return_code = os.system(cmd)
        os.chdir(cwd)
        if return_code != 0:
            raise RuntimeError("Could not apply hotfix")

    _apply_macos_prophet_hotfix()

    extra = default.extra
    if not extra or "prophet" not in extra:
        raise ValueError(
            "Prophet model must be available in DataContainer 'extra' key to plot"
        )

    node_name = __name__.split(".")[-1]

    model = model_from_json(extra["prophet"])
    if extra.get("run_forecast"):
        forecast = default.m
    else:
        future = model.make_future_dataframe(periods=periods)
        forecast = model.predict(future)

    fig = plot_components_plotly(model, forecast)
    fig.update_layout(
        dict(title=node_name, autosize=True, template={}, height=None, width=None),
        overwrite=True,
    )

    return Plotly(fig=fig)
