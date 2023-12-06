from typing import Literal

from pydantic import BaseModel


class DocsVideo(BaseModel):
    source: Literal["youtube"]
    link: str
    title: str
