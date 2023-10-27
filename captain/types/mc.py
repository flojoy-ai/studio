from pydantic import BaseModel


"""
Models for body POST requests
"""
class HasRequirements(BaseModel):
    port: str

class UploadFirmware(BaseModel):
    destination: str


"""
Error types:
"""
class NoPortError(Exception):
    def __init__(self, message="The backend did not receive a port"):
        self.message = message
        super().__init__(message)

class MCTestError(Exception):
    def __init__(self, message="MC Test Error"):
        self.message = message
        super().__init__(message)

