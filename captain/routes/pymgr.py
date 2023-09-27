from fastapi import APIRouter
import subprocess
import json

router = APIRouter(prefix="/pymgr", tags=["pymgr"])


@router.get("/envs")
async def list_envs():
    result = subprocess.run(
        ["micromamba", "env", "list", "--json"], capture_output=True, text=True
    )

    output = result.stdout

    data = json.loads(output)

    return data
