from fastapi import APIRouter, HTTPException, Response, status
from flojoy import set_frontier_api_key, get_credentials
from captain.types.key import GetKeyResponse


router = APIRouter(tags=["key"])


@router.post("/key/")
async def set_key(data: dict[str, str]):
    apiKey = data["key"]
    apiValue = data["value"]
    set_frontier_api_key(apiKey, apiValue)
    return Response(status_code=200)


@router.get("/key/", response_model=GetKeyResponse)
async def get_key():
    keys: list[dict[str, str]] | None = get_credentials()
    for key in keys:
        print(key)
    if keys is None:
        return HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="No key found!"
        )
    return GetKeyResponse(key=keys)
