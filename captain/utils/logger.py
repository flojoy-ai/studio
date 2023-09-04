import logging
import os
import sys

logger = logging.getLogger("fastapi-dev")
logging.basicConfig(level=logging.INFO, format="%(name)s - %(levelname)s - %(message)s")


def logger_setup(logger: logging.Logger):
    log_lvl = get_log_level()
    logger.setLevel(log_lvl)

    handler = logging.StreamHandler()
    handler.setLevel(log_lvl)

    if os.environ.get("FASTAPI_LOG"):
        formatter = CustomFormatter("%(levelname)-10s%(message)s")
    else:
        formatter = CustomFormatter("%(message)s")

    handler.setFormatter(formatter)

    logger.addHandler(handler)


def get_log_level():
    map_to_int = {
        "debug": logging.DEBUG,
        "info": logging.INFO,
        "warning": logging.WARNING,
        "error": logging.ERROR,
        "critical": logging.CRITICAL,
    }
    log_level = os.environ.get("FASTAPI_LOG", "error")

    return map_to_int[log_level]


class CustomFormatter(logging.Formatter):
    """Ensure a colon immediately follows the levelname in order to copy the fastapi logger"""

    def format(self, record: logging.LogRecord):
        record.levelname = f"{record.levelname}:"
        return super().format(record)
