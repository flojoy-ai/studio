from fastapi import APIRouter

router = APIRouter(prefix="pymgr", tags=["pymgr"])


@router.get("/envs")
async def list_envs():
    pass
