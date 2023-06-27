import uvicorn, os

is_debug_mode = os.environ.get("DEBUG", False)
__ignore_list = ["venv"]

if __name__ == "__main__":
    uvicorn.run(
        "captain.main:app",
        port=8000,
        log_level="debug" if is_debug_mode else "info",
        reload=True,
        reload_excludes=[os.path.join(os.getcwd(), p) for p in __ignore_list],
    )
