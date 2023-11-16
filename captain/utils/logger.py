import os
import logging

logger = logging.getLogger("flojoy")


def get_log_level():
    map_to_int = {
        "debug": logging.DEBUG,
        "info": logging.INFO,
        "warning": logging.WARNING,
        "error": logging.ERROR,
        "critical": logging.CRITICAL,
    }
    log_level = os.environ.get("FASTAPI_LOG", "info")

    return map_to_int[log_level]


logging.basicConfig(
    level=get_log_level(),
    format="[%(asctime)s] - %(name)s - %(levelname)s - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
