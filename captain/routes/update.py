from fastapi import APIRouter
import subprocess

router = APIRouter(tags=["update"])


@router.post("/update/")
async def set_env_var_route():
    subprocess.run(["git", "pull"])
