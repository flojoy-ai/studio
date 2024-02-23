from fastapi import Request, HTTPException, status
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
    studio_cookie = req.cookies.get("studio-auth")

    if not studio_cookie:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=exception_txt,
        )

    try:

        credentials = base64.b64decode(studio_cookie).decode("utf-8")
        username, password = credentials.split(":", 1)
        authorized = validate_credentials(username, password)

        if not authorized:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=exception_txt,
            )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=exception_txt,
        )
