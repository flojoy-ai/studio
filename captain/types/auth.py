from pydantic import BaseModel


class Auth(BaseModel):
    username: str
    password: str
