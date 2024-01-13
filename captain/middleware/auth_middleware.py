from fastapi import Request, HTTPException
from captain.services.auth.auth_service import validate_credentials


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

    if auth_header is None:
        raise HTTPException(
            status_code=403,
            detail=exception_txt,
        )

    auth = auth_header.split(" ")
    if len(auth) != 2:
        raise HTTPException(
            status_code=403,
            detail=exception_txt,
        )
    [username, password] = auth
    authorized = validate_credentials(username, password)

    if authorized:
        return
    else:
        raise HTTPException(
            status_code=403,
            detail=exception_txt,
        )
