import json
import os
import random
import string
import webbrowser

import plotly
from flojoy import Boolean, Optional, Plotly, String, flojoy


@flojoy
def REPORT_GENERATION(
    title: Optional[String],
    img_url: Optional[String],
    introduction: Optional[String],
    test_success: Optional[Boolean],
    figures: Optional[list[Plotly]],
) -> None:
    """Generate an HTML report (saved to user's desktop)

    Parameters
    ----------
    title : String
        The title of the report
    img_url : String
        URL for the logo in the report letterhead
    introduction : String
        Report preamble
    figures : List[Plotly]
        List of Plotly charts to display

    Returns
    -------
    None
    """

    # cwd = os.getcwd()
    cwd = "/Users/jp/Desktop/custom-blocks/REPORT_GEN"
    template_path = os.path.join(cwd, "template.html")
    print(template_path)

    DEFAULT_LOGO = "https://mma.prnewswire.com/media/1708705/MDA_Inc__MDA_announces_CHORUS__as_the_name_of_its_next_market_le.jpg"

    with open(template_path, "r") as f:
        # Read the HTML report template (in the same directory as this block)
        html = f.read()

        # Replace each template section with inputs from this block

        # TITLE
        if title is not None:
            html = html.replace("{{TITLE}}", title.s)

        # INTRODUCTION
        if introduction is not None:
            html = html.replace("{{INTRODUCTION}}", introduction.s)

        # PASS/FAIL
        status_color = "green"
        status = "Pass"
        if not test_success:
            status_color = "red"
            status = "Fail"

        html = html.replace("{{STATUS}}", status)
        html = html.replace("{{STATUS_COLOR}}", status_color)

        # LETTERHEAD LOGO
        if img_url is not None and "http" in img_url and " " not in img_url:
            html = html.replace("{{LOGO_URL}}", img_url.s)
        else:
            html = html.replace("{{LOGO_URL}}", DEFAULT_LOGO)

        # FIGURES

        if figures is not None:
            FIGURES_HTML = ""
            PLOTLY_SCRIPT = ""
            for i in range(len(figures)):
                fig = figures[i].fig
                title = ""
                caption = ""
                if "layout" in fig:
                    title = (
                        fig["layout"]["title"].text if "title" in fig["layout"] else ""
                    )
                    if len(fig["layout"]["annotations"]) > 0:
                        caption = fig["layout"]["annotations"][0].text
                PLOTLY_JSON = json.dumps(plotly.io.to_json(figures[i], validate=False))
                FIGURES_HTML += "<h2>{0}</h2>".format(title)
                FIGURES_HTML += "<div id='figure{0}'></div>".format(i)
                FIGURES_HTML += "<p>{0}</p>".format(caption)
                PLOTLY_SCRIPT += "Plotly.newPlot(document.getElementById('figure{0}'), JSON.parse({1})['fig'])".format(
                    i, PLOTLY_JSON
                )
                PLOTLY_SCRIPT += ";\n\n"
            html = html.replace("{{FIGURES}}", FIGURES_HTML)
            html = html.replace("{{SCRIPT}}", PLOTLY_SCRIPT)

        # Find the user's Desktop
        desktop_dir = os.path.expanduser("~/Desktop")
        fn = (
            "report_"
            + "".join(random.choices(string.ascii_uppercase + string.digits, k=5))
            + ".html"
        )
        full_dir = os.path.join(desktop_dir, fn)

        # Write the HTML app
        f_write = open(full_dir, "x")
        f_write.write(html)
        f.close()

    webbrowser.open_new_tab(full_dir)

    return None
