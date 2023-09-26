import os
import logging
from logging.handlers import RotatingFileHandler

logger = logging.getLogger()


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


logging.basicConfig(level=get_log_level())


def get_log_file_path(service_name: str):
    logs_folder_path = os.path.join(os.getcwd(), ".logs")
    log_file_name = f"log_{service_name}.txt"
    log_file_path = os.path.join(logs_folder_path, log_file_name)
    return logs_folder_path, log_file_name, log_file_path


def logger_setup(logger: logging.Logger):
    handler = logging.StreamHandler()
    formatter = CustomFormatter(
        "[%(asctime)s] - %(levelname)s - %(message)s", "%Y-%m-%d %H:%M:%S"
    )
    log_lvl = get_log_level()

    handler.setLevel(log_lvl)

    handler.setFormatter(formatter)

    logger.addHandler(handler)


# def logger_setup(logger: logging.Logger):
#     logs_folder_path, log_file_name, _ = get_log_file_path("main")

#     if not os.path.exists(logs_folder_path):
#         os.makedirs(logs_folder_path, exist_ok=True)

#     log_file_path = os.path.join(logs_folder_path, log_file_name)
#     handler = RotatingFileHandler(log_file_path, maxBytes=1024 * 1024, backupCount=5)
#     formatter = CustomFormatter(
#         "[%(asctime)s] - %(levelname)s - %(message)s", "%Y-%m-%d %H:%M:%S"
#     )
#     log_lvl = get_log_level()

#     handler.setLevel(log_lvl)

#     handler.setFormatter(formatter)

#     logger.addHandler(handler)


class CustomFormatter(logging.Formatter):
    """Ensure a colon immediately follows the levelname in order to copy the fastapi logger"""

    def format(self, record: logging.LogRecord):
        record.levelname = f"{record.levelname}:"
        return super().format(record)
