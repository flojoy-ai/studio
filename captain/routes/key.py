from fastapi import APIRouter, HTTPException, Response, status
from flojoy import set_frontier_api_key

router = APIRouter(tags=["key"])


@router.post("/key/")
async def set_key(data: dict):
    apiKey = data["key"]
    apiValue = data["value"]
    set_frontier_api_key(apiKey, apiValue)
    return Response(status_code=200)
