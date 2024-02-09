# from __future__ import annotations
# from enum import Enum
# from typing import ForwardRef, Union, Optional, List, Literal, Any
# from pydantic import BaseModel, Field, root_validator
#
#
# class TestType(str, Enum):
#     Python = "Python"
#     Flojoy = "Flojoy"
#     Matlab = "Matlab"
#
#
# class TestStatus(str, Enum):
#     Pending = "pending"
#     Processing = "processing"
#     Pass = "pass"
#     Failed = "failed"
#
#
# class TestNode:
#     type: Literal["test"]
#     id: str
#     path: str
#     test_name: str = Field(alias="testName")
#     run_in_parallel: bool = Field(alias="runInParallel")
#     test_type: TestType = Field(alias="testType")
#     status: TestStatus
#     completion_time: float = Field(alias="completionTime")
#     is_saved_to_cloud: bool = Field(alias="isSavedToCloud")
#
#
#
# class RoleTypes(str, Enum):
#     Start = "start"
#     Between = "between"
#     End = "end"
#
#
# class ConditionalTypes(str, Enum):
#     If = "if"
#     Else = "else"
#     Elif = "elif"
#     End = "end"
#
#
# class Summary(BaseModel):
#     id: str = Field(alias="id")
#     success_rate: float = Field(alias="successRate")
#     completion_time: float = Field(alias="completionTime")
#
#


#
#
# class ConditionalNode(BaseModel):
#     type: Literal["conditional"]
#     conditional_type: ConditionalTypes = Field(alias="conditionalType")
#     role: RoleTypes
#     id: str
#     group_id: str = Field(alias="groupId")
#     condition: str
#
#
# class IfNode(ConditionalNode):
#     conditional_type: Literal["if"] = Field(alias="conditionalType")
#     main: List[TestSequenceElementNode]
#     else_: List[TestSequenceElementNode] = Field(alias="else")
#
#
# class TestRootNode(BaseModel):
#     type: str
#     children: List[TestSequenceElementNode]
#
#
# TestSequenceElementNode = Union[IfNode, TestNode, TestRootNode]
# # _______________________________________________________________________
#
#
# class Message(BaseModel):
#     event: str
#     data: Any
#
#
# class Subscription(Message):
#     event: Literal["subscribe"]
#
#     class Data(BaseModel):
#         message: str
#
#     data: Data
#
#
# class RunRequest(Message):
#     event: Literal["run"]  # overwriting
#
#     class Data(BaseModel):
#         tree: TestRootNode
#
#     data: Data
