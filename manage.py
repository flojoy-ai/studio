import uvicorn
import os

__ignore_list = ["venv"]

if __name__ == "__main__":
    is_debug_mode = os.environ.get("DEBUG", False)

    uvicorn.run(
        "captain.main:app",
        port=5392,
        log_level="debug" if is_debug_mode else "error",
        reload=True,
        reload_excludes=[
            os.path.join(os.getcwd(), p)
            for p in __ignore_list
            if os.path.exists(os.path.join(os.getcwd(), p))
        ],
    )
