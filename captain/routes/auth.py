from fastapi import APIRouter, Response, status
from captain.services.auth.auth_service import (
    validate_credentials,
    get_base64_credentials,
)
from captain.utils.logger import logger
from captain.types.auth import Auth

router = APIRouter(tags=["auth"])


@router.post("/auth/login/")
async def login(response: Response, auth: Auth):
    if not validate_credentials(auth.username, auth.password):
        response.set_cookie(
            key="studio-auth",
            value="",
            path="/",
            samesite="none",
            secure=True,
        )
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return "Login failed"

    encoded_credentials = get_base64_credentials(auth.username, auth.password)
    logger.info(f"encoded credentials: {encoded_credentials}")
    response.set_cookie(
        key="studio-auth",
        value=encoded_credentials,
        path="/",
        samesite="none",
        secure=True,
    )
    response.status_code = status.HTTP_200_OK
    return "Login successful"
