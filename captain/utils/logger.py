import os
import logging
import yaml
from captain.utils.blocks_path import get_flojoy_dir

logger = logging.getLogger("flojoy")


def load_log_level_from_config():
    flojoy_config_path = os.path.join(get_flojoy_dir(), "flojoy.yaml")
    if os.path.exists(flojoy_config_path):
        with open(flojoy_config_path) as f:
            data = yaml.safe_load(f)
    else:
        with open(flojoy_config_path, "w") as f:
            data = {"LOG_LEVEL": "INFO"}
            f.write(yaml.dump(data))

    log_level = data.get("LOG_LEVEL", "INFO")
    return log_level


logging.basicConfig(
    level=load_log_level_from_config(),
    format="[%(asctime)s] - %(name)s - %(levelname)s - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
