from fastapi import APIRouter, HTTPException, Response, status
from flojoy.utils import set_frontier_api_key, get_frontier_api_key

from captain.types.key import GetKeyResponse

router = APIRouter(tags=["key"])


@router.post("/key/")
async def set_key(api_key: str):
    set_frontier_api_key(api_key)
    return Response(status_code=200)


@router.get("/key/", response_model=GetKeyResponse)
async def get_key():
    key: str | None = get_frontier_api_key()
    if key is None:
        return HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="No key found!"
        )
    return GetKeyResponse(key=key)
