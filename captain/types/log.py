from pydantic import BaseModel


class LogLevel(BaseModel):
    level: str
