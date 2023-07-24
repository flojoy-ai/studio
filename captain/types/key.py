from pydantic import BaseModel


class GetKeyResponse(BaseModel):
    key: str | list[dict[str, str]]
