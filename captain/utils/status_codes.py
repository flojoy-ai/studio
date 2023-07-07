import yaml

STATUS_CODES = yaml.load(
    open("STATUS_CODES.yml", "r", encoding="utf-8"), Loader=yaml.Loader
)
