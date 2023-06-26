import uvicorn, os

__ignore_list = ["venv"]

if __name__ == "__main__":
    uvicorn.run(
        "captain.main:app",
        port=8000,
        reload=True,
        reload_excludes=[os.path.join(os.getcwd(), p) for p in __ignore_list],
    )
