from typing import Optional

from fastapi import APIRouter, HTTPException, Response, status
from flojoy import delete_env_var, get_credentials, get_env_var, set_env_var

from captain.types.key import EnvVar

router = APIRouter(tags=["env"])


@router.post("/env/")
async def set_env_var_route(env_var: EnvVar):
    try:
        set_env_var(env_var.key, env_var.value)
    except Exception as e:
        return HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=e
        )

    return Response(status_code=200)


@router.delete("/env/{key_name}")
async def delete_env_var_route(key_name: str):
    try:
        delete_env_var(key_name)
    except Exception as e:
        return HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=e
        )
    return Response(status_code=200)


@router.get("/env/{key_name}", response_model=EnvVar)
async def get_env_var_by_name_route(key_name: str):
    value: Optional[str] = get_env_var(key_name)
    if value is None:
        return HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="No key found!"
        )

    return EnvVar(key=key_name, value=value)


@router.get("/env/", response_model=list[EnvVar])
async def get_env_vars_route():
    values = get_credentials()
    if values is None:
        return HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="No key found!"
        )

    return values
