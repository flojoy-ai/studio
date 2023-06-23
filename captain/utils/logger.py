import logging
import sys


"""NOTE: If you want to print the output of the RQ worker, then in the command line add PRINT_WORKER_OUTPUT=True"""

logger = logging.getLogger("fastapi-dev")

def logger_setup(logger):
    log_lvl = get_log_level()
    logger.setLevel(log_lvl)
    
    handler = logging.StreamHandler()
    handler.setLevel(log_lvl)
    
    formatter = CustomFormatter("%(levelname)-10s%(message)s")
    handler.setFormatter(formatter)
    
    logger.addHandler(handler)
    
def get_log_level():
    map_to_int = {
        'debug': logging.DEBUG,
        'info': logging.INFO,
    }
    log_level = 'info'
    if "--log-level" in sys.argv:
        log_level = sys.argv[sys.argv.index("--log-level") + 1]
    return map_to_int[log_level]

class CustomFormatter(logging.Formatter):
    """Ensure a colon immediately follows the levelname in order to copy the fastapi logger"""
    def format(self, record):
        record.levelname = f"{record.levelname}:"
        return super().format(record)

