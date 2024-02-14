from typing import Optional, List, Union, Literal
from pydantic import BaseModel, Field
from enum import Enum


class Summary(BaseModel):
    id: str = Field(..., alias="id")
    success_rate: float = Field(..., alias="successRate")
    completion_time: float = Field(..., alias="completionTime")


class LockedContextType(BaseModel):
    is_locked: bool = Field(..., alias="isLocked")


class TestTypes(str, Enum):
    Python = "Python"
    Flojoy = "Flojoy"
    Matlab = "Matlab"


class StatusTypes(str, Enum):
    pending = "pending"
    pass_ = "pass"
    failed = "failed"


class MsgState(str, Enum):
    TEST_SET_START = "TEST_SET_START"
    RUNNING = "RUNNING"
    TEST_DONE = "TEST_DONE"
    ERROR = "ERROR"
    TEST_SET_DONE = "TEST_SET_DONE"


class BackendMsg(BaseModel):
    state: MsgState = Field(..., alias="state")
    target_id: str = Field(..., alias="targetId")
    result: bool = Field(..., alias="result")
    time_taken: float = Field(..., alias="timeTaken")
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


TestSequenceEvents = Literal["run", "subscribe"]


class TestData(BaseModel):
    tree: TestRootNode


class TestSequenceRun(BaseModel):
    event: TestSequenceEvents
    data: Union[str, TestRootNode]
