from pydantic import BaseModel


class HasRequirements(BaseModel):
    port: str


# define errors below
class MCTestError(Exception):
    def __init__(self, message="MC Test Error"):
        self.message = message
        super().__init__(message)
