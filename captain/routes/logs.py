from fastapi import APIRouter
from captain.utils.logger import get_log_file_path
import os

router = APIRouter(tags=["logs"])


@router.get("/logs")
def get_logs():
    try:
        _, _, log_file_path = get_log_file_path("main")
        if not os.path.exists(log_file_path):
            return "No logs found!"
        with open(log_file_path, "r") as log_file:
            logs = log_file.read()
        return logs
    except Exception:
        return "No logs found!"
