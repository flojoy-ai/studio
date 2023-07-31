from fastapi import APIRouter, HTTPException, Response, status
from flojoy import set_env_var_key, get_credentials, modify_env_var_key
from captain.types.key import GetKeyResponse


router = APIRouter(tags=["env"])


@router.post("/env/")
async def set_env_var(data: dict[str, str]):
    key = data["key"]
    value = data["value"]
    set_env_var_key(key, value)
    return Response(status_code=200)


@router.get("/env/", response_model=GetKeyResponse)
async def get_env_var():
    env_vars: dict[str, str] | None = get_credentials()
    for username, password in env_vars.items():
        print(username, password)
    if env_vars is None:
        return HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="No key found!"
        )
    return GetKeyResponse(env_var=env_vars)


@router.post("/env/modify")
async def modify_env_var(data: dict[str, str]):
    key = data["key"]
    value = data["value"]
    modify_env_var_key(key, value)
    return Response(status_code=200)
