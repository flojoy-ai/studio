from pydantic import BaseModel


class GetKeyResponse(BaseModel):
    env_var: str | dict[str, str]
