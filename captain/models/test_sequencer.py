from enum import Enum
from typing import List, Literal, Optional, Union

from pydantic import BaseModel, Field


class Summary(BaseModel):
    id: str = Field(..., alias="id")
    success_rate: float = Field(..., alias="successRate")
    completion_time: float = Field(..., alias="completionTime")


class LockedContextType(BaseModel):
    is_locked: bool = Field(..., alias="isLocked")


class TestTypes(str, Enum):
    pytest = "pytest"
    python = "python"
    flojoy = "flojoy"
    matlab = "matlab"


class StatusTypes(str, Enum):
    pending = "pending"
    pass_ = "pass"
    failed = "failed"


class MsgState(str, Enum):
    test_set_start = "test_set_start"
    test_set_export = "test_set_export"
    running = "running"
    test_done = "test_done"
    error = "error"
    test_set_done = "test_set_done"


class BackendMsg(BaseModel):
    state: MsgState = Field(..., alias="state")
    target_id: str = Field(..., alias="targetId")
    result: bool = Field(..., alias="result")
    time_taken: float = Field(..., alias="timeTaken")
    is_saved_to_cloud: bool = Field(..., alias="isSavedToCloud")
    error: Optional[str] = Field(None, alias="error")


class Test(BaseModel):
    type: str = Field("test", alias="type")
    id: str = Field(..., alias="id")
    group_id: str = Field(..., alias="groupId")
    path: str = Field(..., alias="path")
    test_name: str = Field(..., alias="testName")
    run_in_parallel: bool = Field(..., alias="runInParallel")
    test_type: TestTypes = Field(..., alias="testType")
    status: StatusTypes = Field(..., alias="status")
    completion_time: Optional[float] = Field(None, alias="completionTime")
    is_saved_to_cloud: bool = Field(..., alias="isSavedToCloud")
    export_to_cloud: bool = Field(..., alias="exportToCloud")


class Role(str, Enum):
    start = "start"
    between = "between"
    end = "end"


class ConditionalComponent(str, Enum):
    if_ = "if"
    else_ = "else"
    elif_ = "elif"
    end = "end"


class ConditionalLeader(str, Enum):
    if_ = "if"


class Conditional(BaseModel):
    type: str = Field("conditional", alias="type")
    conditional_type: ConditionalComponent = Field(..., alias="conditionalType")
    role: Role = Field(..., alias="role")
    id: str = Field(..., alias="id")
    group_id: str = Field(..., alias="groupId")


class IfNode(Conditional):
    conditional_type: str = Field("if", alias="conditionalType")
    condition: str = Field(..., alias="condition")
    main: List["TestSequenceElementNode"] = Field(..., alias="main")
    else_: List["TestSequenceElementNode"] = Field(..., alias="else")


class ConditionalNode(IfNode):
    pass


class TestNode(Test):
    pass


TestSequenceElementNode = Union[ConditionalNode, TestNode]

IfNode.model_rebuild()


class TestRootNode(BaseModel):
    type: str = Field("root", alias="type")
    children: List[TestSequenceElementNode] = Field(..., alias="children")
    identifiers: List[str]


class TestDiscoveryResponse(BaseModel):
    test_name: str = Field(..., alias="testName")
    path: str = Field(..., alias="path")


class TestDiscoverContainer(BaseModel):
    response: List[TestDiscoveryResponse] = Field(..., alias="response")


TestSequenceEvents = Literal["run", "stop", "subscribe", "export"]


class TestData(BaseModel):
    tree: TestRootNode


class TestSequenceRun(BaseModel):
    event: TestSequenceEvents
    data: Union[str, TestRootNode]
    hardware_id: Union[str, None]
    project_id: Union[str, None]
