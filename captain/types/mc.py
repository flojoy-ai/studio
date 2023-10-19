from pydantic import BaseModel

class HasRequirements(BaseModel):
    port: str