from logging import LogRecord
import os
import logging
from captain.internal.wsmanager import ConnectionManager

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


def logger_setup(logger: logging.Logger):
    handler = BroadcastLogs()
    log_lvl = get_log_level()
    handler.setLevel(log_lvl)
    logger.addHandler(handler)


class CustomFormatter(logging.Formatter):
    def __init__(self) -> None:
        super().__init__(
            fmt="[%(asctime)s] - %(name)s - %(levelname)s - %(message)s",
            datefmt="%Y-%m-%d %H:%M:%S",
        )


class BroadcastLogs(logging.Handler):
    def __init__(self, level=0) -> None:
        super().__init__(level)
        self.ws = ConnectionManager.get_instance()
        self.setFormatter(CustomFormatter())

    def emit(self, record: LogRecord) -> None:
        log_entry = self.format(record)
        self.ws.log_queue.put(log_entry)
