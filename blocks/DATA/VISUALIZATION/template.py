import plotly.graph_objects as go


def init_template():
    template = go.layout.Template()

    # pythonic autotyping of numeric strings
    template.layout.autotypenumbers = "strict"

    # minimiz margins
    # template.layout.margin = dict(t=0, l=10, b=10, r=0)

    return template


def plot_layout(title: str) -> go.Layout:
    autosize = True
    margin = {"t": 30, "r": 0, "b": 0, "l": 0}
    xaxis = {"type": "-"}

    layout = go.Layout()
    layout.title = title
    layout.autosize = autosize
    layout.margin = margin
    layout.xaxis = xaxis
    layout.template = {}
    return layout
