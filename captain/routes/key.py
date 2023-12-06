from typing import Optional

from fastapi import APIRouter, Response, status
from flojoy import delete_env_var, get_credentials, get_env_var, set_env_var

from captain.types.key import EnvVar
from captain.utils.logger import logger

router = APIRouter(tags=["env"])


@router.post("/env/")
async def set_env_var_route(env_var: EnvVar):
    try:
        set_env_var(env_var.key, env_var.value, "some")

    except Exception as e:
        logger.error(
            f"error occurred in set_env_var function: {e}, traceback:{e.with_traceback(e.__traceback__)}"
        )
        return Response(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content=e.__str__()
        )

    return Response(status_code=200)


@router.delete("/env/{key_name}")
async def delete_env_var_route(key_name: str):
    try:
        delete_env_var(key_name)
    except Exception as e:
        return Response(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content=e.__str__()
        )
    return Response(status_code=200)


@router.get("/env/{key_name}", response_model=EnvVar)
async def get_env_var_by_name_route(key_name: str):
    value: Optional[str] = get_env_var(key_name)
    if value is None:
        return Response(
            status_code=status.HTTP_400_BAD_REQUEST, content="No key found!"
        )

    return EnvVar(key=key_name, value=value)


@router.get("/env/", response_model=list[EnvVar])
async def get_env_vars_route():
    values = get_credentials()
    if not values:
        return Response(status_code=status.HTTP_404_NOT_FOUND, content="No key found!")
    logger.info(f"retrieved {len(values)} env variables")

    return values
