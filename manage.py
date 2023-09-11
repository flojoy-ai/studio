import uvicorn
import os

__ignore_list = ["venv", "node_modules"]
# __ignore_list = ["venv"]


if __name__ == "__main__":
    import uvicorn
    import os

    log_level = os.environ.get("FASTAPI_LOG", "info")
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
