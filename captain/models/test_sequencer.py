from pydantic import BaseModel
from typing import Literal


class Message(BaseModel):
    event: str

    class Data(BaseModel):
        message: str

    data: Data


class Subscription(Message):
    event: Literal["subscribe"]
