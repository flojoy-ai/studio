import sys
from keyrings.cryptfile.cryptfile import CryptFileKeyring
import keyring
from typing import Optional
from pathlib import Path
from .CONSTANTS import FLOJOY_DIR, CREDENTIAL_FILE, KEYRING_KEY
import os
from .config import logger

__all__ = [
    "get_env_var",
    "set_env_var",
    "delete_env_var",
]


def get_keyring():
    if sys.platform.lower() == "linux":
        kr = CryptFileKeyring()
        kr.keyring_key = KEYRING_KEY
        keyring.set_keyring(kr)
    return keyring


def get_env_var(key: str) -> Optional[str]:
    kr = get_keyring()
    return kr.get_password("flojoy", key)


def set_env_var(key: str, value: str):
    kr = get_keyring()
    kr.set_password("flojoy", key, value)
    home = str(Path.home())
    file_path = os.path.join(home, os.path.join(FLOJOY_DIR, CREDENTIAL_FILE))

    if not os.path.exists(file_path):
        logger.info(f"{file_path} does not exist")
        with open(file_path, "w") as f:
            f.write(key)
        logger.info(f"Env var written to {file_path}")
        return

    logger.info(f"{file_path} exists, writing env to {file_path}")
    with open(file_path, "r") as f:
        keys = f.read().strip().split(",")
        if key not in keys:
            keys.append(key)

    with open(file_path, "w") as f:
        f.write(",".join(keys))


def delete_env_var(key: str):
    home = str(Path.home())
    file_path = os.path.join(home, os.path.join(FLOJOY_DIR, CREDENTIAL_FILE))

    if not os.path.exists(file_path):
        return

    with open(file_path, "r") as f:
        keys = f.read().strip().split(",")

    if key not in keys:
        return

    keys.remove(key)

    with open(file_path, "w") as f:
        f.write(",".join(keys))

    kr = get_keyring()
    kr.delete_password("flojoy", key)
