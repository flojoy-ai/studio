from fastapi import Request, HTTPException
from captain.services.auth.auth_service import validate_credentials
import base64


async def is_admin(req: Request):
    """
    Middleware to check if the user is an admin

    Example of use
    @router.get("/write", dependencies=[Depends(is_admin)])
    async def update():
        return "resource updated"

    """
    exception_txt = "You are not authorized to perform this action"
    auth_header = req.headers.get("Authorization")

    if not auth_header or not auth_header.startswith("Basic "):
        raise HTTPException(
            status_code=403,
            detail=exception_txt,
        )
    try:
        credentials_b64 = auth_header[6:]
        credentials = base64.b64decode(credentials_b64).decode("utf-8")

        username, password = credentials.split(":", 1)
        authorized = validate_credentials(username, password)

        if not authorized:
            raise HTTPException(
                status_code=403,
                detail=exception_txt,
            )
    except Exception:
        raise HTTPException(
            status_code=403,
            detail=exception_txt,
        )
