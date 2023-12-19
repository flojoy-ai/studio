from flojoy import Plotly, TextArea, flojoy


@flojoy
def ANNOTATE_PLOTLY(
    default: Plotly,
    title: str = "",
    caption: TextArea = TextArea(""),
    # xaxis: str = "",
    # yaxis: str = "",
) -> Plotly:
    """Add context to a Plotly figure (title, caption, and axis labels).

    Parameters
    ----------
    default : Plotly
        The Plotly figure object

    Returns
    -------
    Plotly
        The annotated Plotly object
    """

    FLOJOY_COLORS = ["#7B61FF", "#2E83FF", "#FFA927", "#E14092"]

    fig = default.fig

    # Set marker colors to Flojoy brand
    for i in range(len(fig["data"])):
        if i < len(FLOJOY_COLORS):
            if "marker" in fig["data"][i]:
                fig["data"][i]["marker"]["color"] = FLOJOY_COLORS[i]

    fig["layout"]["title"] = {"text": title, "font": {"color": "rgba(0,0,0,0)"}}
    fig["layout"]["annotations"] = [
        {"text": caption, "showarrow": False, "visible": False}
    ]

    # 3d only
    if "scene" in fig["layout"]:
        fig["layout"]["scene"]["aspectratio"] = dict(x=1, y=1, z=1)
        if "marker" in fig["data"][0]:
            fig["data"][0]["marker"]["colorscale"] = "purples"

    return Plotly(fig=fig)
