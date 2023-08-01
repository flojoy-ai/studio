from pydantic import BaseModel


class EnvVar(BaseModel):
    key: str
    value: str
