import os

import uvicorn

from captain.utils.logger import load_log_level_from_config

__ignore_list = ["venv"]


if __name__ == "__main__":
    log_level = load_log_level_from_config().lower()
    is_dev = os.environ.get("DEPLOY_STATUS", "prod") == "dev"
    uvicorn.run(
        "captain.main:app",
        port=5392,
        log_level=log_level,
        reload=is_dev,
        reload_excludes=[
            os.path.join(os.getcwd(), p)
            for p in __ignore_list
            if os.path.exists(os.path.join(os.getcwd(), p))
        ],
    )
