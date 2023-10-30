import logging

LOGGER_NAME = "flojoy"


class FlojoyConfig:
    _instance = None

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = FlojoyConfig()
        return cls._instance

    def __init__(self):
        self.is_offline = False


logger = logging.getLogger(LOGGER_NAME)
