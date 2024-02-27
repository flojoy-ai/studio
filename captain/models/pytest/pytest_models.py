from pydantic import BaseModel, Field
from typing import Optional, List


class Result(BaseModel):
    nodeid: str
    type: str


class Collector(BaseModel):
    nodeid: str
    outcome: str
    result: List[Result]
    longrepr: Optional[str] = None


class Summary(BaseModel):
    collected: int
    total: int


class RootModel(BaseModel):
    collectors: Optional[List[Collector]]
    created: float
    duration: float
    environment: dict
    exitcode: int
    root: str
    summary: Summary
    tests: List


class TestDiscoveryResponse(BaseModel):
    path: str
    test_name: str = Field(serialization_alias="testName")

    class Config:
        allow_population_by_field_name = True


class TestDiscoverContainer(BaseModel):
    response: List[TestDiscoveryResponse]
    missing_libraries: List[str] = Field(..., alias="missingLibraries")
