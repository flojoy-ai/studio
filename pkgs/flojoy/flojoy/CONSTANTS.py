import os
import sys

KEY_WORKER_JOBS = "WORKER_JOBS"
KEY_ALL_JOBEST_IDS = "ALL_JOBSET_IDS"
FLOJOY_DIR = ".flojoy"
CREDENTIAL_FILE = "credentials.txt"
if sys.platform == "win32":
    FLOJOY_CACHE_DIR = os.path.realpath(os.path.join(os.environ["APPDATA"], FLOJOY_DIR))
else:
    FLOJOY_CACHE_DIR = os.path.realpath(os.path.join(os.environ["HOME"], FLOJOY_DIR))
