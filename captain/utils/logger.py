import logging
import os
import sys

logger = logging.getLogger("fastapi-dev")


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
    }
    log_level = "info"
    if "--log-level" in sys.argv:
        log_level = sys.argv[sys.argv.index("--log-level") + 1]

    return map_to_int[log_level]


class CustomFormatter(logging.Formatter):
    """Ensure a colon immediately follows the levelname in order to copy the fastapi logger"""

    def format(self, record: logging.LogRecord):
        record.levelname = f"{record.levelname}:"
        return super().format(record)
