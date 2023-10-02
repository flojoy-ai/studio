import base64
import json
import subprocess

import yaml
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/pymgr", tags=["pymgr"])


class CreateEnv(BaseModel):
    name: str


@router.get("/envs")
async def list_envs():
    result = subprocess.run(
        ["micromamba", "env", "list", "--json"], capture_output=True, text=True
    )

    output = result.stdout

    data = json.loads(output)

    return data


@router.get("/env/{path}")
async def get_env(path: str):
    result = subprocess.run(
        ["micromamba", "env", "-p", base64.b64decode(path), "export", "--no-build"],
        capture_output=True,
        text=True,
    )

    output = result.stdout

    data = yaml.safe_load(output)

    return data


@router.post("/env")
async def create_env(env: CreateEnv):
    result = subprocess.run(
        ["micromamba", "env", "create", "-n", env.name, "--json"],
        capture_output=True,
        text=True,
    )

    output = result.stdout

    data = json.loads(output)

    return data


@router.delete("/env")
async def delete_env():
    pass
