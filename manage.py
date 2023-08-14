import asyncio
import uvicorn
import os

__ignore_list = ["venv"]

if __name__ == "__main__":
    log_level = os.environ.get("FASTAPI_LOG", "error")
    uvicorn.run(
        "captain.main:app",
        port=8000,
        log_level=log_level,
        reload=True,
        reload_excludes=[
            os.path.join(os.getcwd(), p)
            for p in __ignore_list
            if os.path.exists(os.path.join(os.getcwd(), p))
        ],
    )
