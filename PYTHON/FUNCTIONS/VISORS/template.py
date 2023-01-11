import plotly.graph_objects as go

def init_template():

    template = go.layout.Template()

    # pythonic autotyping of numeric strings
    template.layout.autotypenumbers = "strict"

    # minimiz margins
    # template.layout.margin = dict(t=0, l=10, b=10, r=0)

    return template

