import os

import uvicorn

__ignore_list = ["venv"]


if __name__ == "__main__":
    log_level = os.environ.get("FASTAPI_LOG", "info")
    is_dev = os.environ.get("DEPLOY_STATUS", "prod") == "dev"
    is_remote = os.getenv("DEPLOY_ENV", "local") == "remote"
    uvicorn.run(
        "captain.main:app",
        port=5392,
        host="0.0.0.0" if is_remote else "127.0.0.1",
        log_level=log_level,
        reload=is_dev,
        reload_excludes=[
            os.path.join(os.getcwd(), p)
            for p in __ignore_list
            if os.path.exists(os.path.join(os.getcwd(), p))
        ],
    )
