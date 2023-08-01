from fastapi import APIRouter, HTTPException, Response, status
from flojoy import (
    set_env_var_key,
    get_credentials,
    edit_env_var_key,
    delete_env_var_key,
)
from captain.types.key import GetKeyResponse


router = APIRouter(tags=["env"])


@router.post("/env/")
async def set_env_var(data: dict[str, str]):
    key = data["key"]
    value = data["value"]
    set_env_var_key(key, value)
    return Response(status_code=200)


@router.post("/env/edit")
async def edit_env_var(data: dict[str, str]):
    key = data["key"]
    value = data["value"]
    edit_env_var_key(key, value)
    return Response(status_code=200)


@router.post("/env/delete")
async def delete_env_var(data: dict[str, str]):
    key = data["key"]
    delete_env_var_key(key)
    return Response(status_code=200)


@router.get("/env/", response_model=GetKeyResponse)
async def get_env_vars():
    env_vars: list[dict[str, str]] | None = get_credentials()
    if env_vars is None:
        return HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="No key found!"
        )
    return GetKeyResponse(env_var=env_vars)
