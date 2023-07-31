from pydantic import BaseModel


class GetKeyResponse(BaseModel):
    env_var: str | list[dict[str, str]]
