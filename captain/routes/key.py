from fastapi import APIRouter, HTTPException, Response, status
from flojoy import set_frontier_api_key
from captain.types.key import GetKeyResponse


router = APIRouter(tags=["key"])


@router.post("/key/")
async def set_key(data: dict):
    apiKey = data["key"]
    apiValue = data["value"]
    print("This is apikey and value: ", apiKey, apiValue)
    set_frontier_api_key(apiKey, apiValue)
    return Response(status_code=200)


@router.get("/key/", response_model=GetKeyResponse)
async def get_key():
    key: str | None = get_all_keys()
    if key is None:
        return HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="No key found!"
        )
    return GetKeyResponse(key=key)
