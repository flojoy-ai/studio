import yaml
import os

STATUS_CODES = yaml.load(
    open(
        os.path.join(os.path.dirname(__file__), "STATUS_CODES.yml"),
        "r",
        encoding="utf-8",
    ),
    Loader=yaml.Loader,
)
