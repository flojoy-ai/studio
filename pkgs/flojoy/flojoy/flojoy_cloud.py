import datetime
import json
import os
from typing import Literal, Optional, TypeVar, overload

import numpy as np
from pydantic.utils import to_camel
import requests
from pydantic import BaseModel, ConfigDict, TypeAdapter


class NumpyEncoder(json.JSONEncoder):
    """json encoder for numpy types."""

    def default(self, o):
        if isinstance(o, np.integer):
            return int(o)
        elif isinstance(o, np.floating):
            return float(o)
        elif isinstance(o, np.ndarray):
            return o.tolist()
        return json.JSONEncoder.default(self, o)


T = TypeVar("T", bound=BaseModel)
U = TypeVar("U")


class CloudModel(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)
    id: str
    created_at: datetime.datetime


class Device(CloudModel):
    name: str
    updated_at: datetime.datetime
    project_id: str


StorageProvider = Literal["s3", "local"]

MeasurementType = Literal["boolean", "dataframe"]


class Measurement(CloudModel):
    name: str
    device_id: str
    test_id: str
    measurement_type: MeasurementType
    storage_provider: StorageProvider
    data: dict
    is_deleted: bool


class Test(CloudModel):
    name: str
    updated_at: datetime.datetime
    measurement_type: MeasurementType
    project_id: str


class Project(CloudModel):
    name: str
    updated_at: Optional[datetime.datetime]
    workspace_id: str


PlanType = Literal["hobby", "pro", "enterprise"]


class Workspace(CloudModel):
    name: str
    plan_type: PlanType
    total_seats: int
    updated_at: Optional[datetime.datetime]


class FlojoyCloud:
    api_key: str

    def __init__(
        self, api_key: Optional[str] = None, cloud_url="https://cloud.flojoy.ai"
    ):
        if api_key is None:
            env = os.environ.get("FLOJOY_CLOUD_API_KEY")
            if env is None:
                raise EnvironmentError(
                    "Flojoy cloud api key not set, and no 'FLOJOY_CLOUD_API_KEY' environment variable was found."
                )
            api_key = env
        self.api_key = api_key
        self.base_url = cloud_url + "/api"

    def __make_query_string(self, query_params: dict[str, int | str]):
        if not query_params:
            return ""

        return "?" + "&".join(f"{k}={v}" for k, v in query_params.items())

    @overload
    def __parse(self, model: type[T], json_str: str) -> T:
        ...

    @overload
    def __parse(self, model: TypeAdapter[U], json_str: str) -> U:
        ...

    def __parse(self, model: type[T] | TypeAdapter[U], json_str: str):
        match model:
            case TypeAdapter():
                return model.validate_json(json_str)
            case _:
                return model.model_validate_json(json_str)

    @overload
    def __get(
        self, endpoint: str, query_params: dict[str, int | str], parse_as: type[T]
    ) -> T:
        ...

    @overload
    def __get(
        self,
        endpoint: str,
        query_params: dict[str, int | str],
        parse_as: TypeAdapter[U],
    ) -> U:
        ...

    def __get(
        self,
        endpoint: str,
        query_params: dict[str, int | str],
        parse_as: type[T] | TypeAdapter[U],
    ) -> T | U:
        res = requests.get(
            self.base_url + endpoint + self.__make_query_string(query_params),
            headers={"Authorization": self.api_key},
        )
        return self.__parse(parse_as, res.text)

    @overload
    def __put(
        self, endpoint: str, query_params: dict[str, int | str], parse_as: type[T]
    ) -> T:
        ...

    @overload
    def __put(
        self,
        endpoint: str,
        query_params: dict[str, int | str],
        parse_as: TypeAdapter[U],
    ) -> U:
        ...

    def __put(
        self,
        endpoint: str,
        query_params: dict[str, int | str],
        parse_as: type[T] | TypeAdapter[U],
    ) -> T | U:
        res = requests.put(
            self.base_url + endpoint + self.__make_query_string(query_params),
            headers={"Authorization": self.api_key},
        )
        return self.__parse(parse_as, res.text)

    @overload
    def __patch(
        self, endpoint: str, query_params: dict[str, int | str], parse_as: type[T]
    ) -> T:
        ...

    @overload
    def __patch(
        self,
        endpoint: str,
        query_params: dict[str, int | str],
        parse_as: TypeAdapter[U],
    ) -> U:
        ...

    def __patch(
        self,
        endpoint: str,
        query_params: dict[str, int | str],
        parse_as: type[T] | TypeAdapter[U],
    ) -> T | U:
        res = requests.put(
            self.base_url + endpoint + self.__make_query_string(query_params),
            headers={"Authorization": self.api_key},
        )
        return self.__parse(parse_as, res.text)

    @overload
    def __delete(
        self, endpoint: str, query_params: dict[str, int | str], parse_as: type[T]
    ) -> T:
        ...

    @overload
    def __delete(
        self,
        endpoint: str,
        query_params: dict[str, int | str],
        parse_as: TypeAdapter[U],
    ) -> U:
        ...

    @overload
    def __delete(
        self, endpoint: str, query_params: dict[str, int | str], parse_as: None = None
    ) -> None:
        ...

    def __delete(
        self,
        endpoint: str,
        query_params: dict[str, int | str],
        parse_as: type[T] | TypeAdapter[U] | None = None,
    ) -> T | U | None:
        res = requests.delete(
            self.base_url + endpoint + self.__make_query_string(query_params),
            headers={"Authorization": self.api_key},
        )
        if parse_as is None:
            return None

        return self.__parse(parse_as, res.text)

    @overload
    def __post(self, endpoint: str, body: dict, parse_as: type[T]) -> T:
        ...

    @overload
    def __post(
        self,
        endpoint: str,
        body: dict,
        parse_as: TypeAdapter[U],
    ) -> U:
        ...

    @overload
    def __post(
        self,
        endpoint: str,
        body: dict,
        parse_as: None = None,
    ) -> None:
        ...

    def __post(
        self,
        endpoint: str,
        body: dict,
        parse_as: type[T] | TypeAdapter[U] | None = None,
    ) -> T | U | None:
        res = requests.post(
            self.base_url + endpoint,
            json=body,
            headers={"Authorization": self.api_key},
        )

        if parse_as is None:
            return None
        return self.__parse(parse_as, res.text)

    """Test Endpoints"""

    def create_test(
        self, name: str, project_id: str, measurement_type: MeasurementType
    ) -> Test:
        return self.__post(
            "/tests",
            {
                "name": name,
                "projectId": project_id,
                "measurementType": measurement_type,
            },
            parse_as=Test,
        )

    def get_test_by_id(self, test_id: str, create_if_not_exist=False):
        return self.__get("/tests", {"testId": test_id}, parse_as=Test)

    def get_all_tests_by_project_id(self, project_id: str):
        return self.__get(
            "/tests", {"projectId": project_id}, parse_as=TypeAdapter(list[Test])
        )

    """Device Endpoints"""

    def create_device(self, name: str, project_id: str):
        return self.__post(
            "/devices", {"name": name, "projectId": project_id}, parse_as=Device
        )

    def create_devices(self, name: str, project_id: str):
        return self.__post(
            "/devices",
            {"name": name, "projectId": project_id},
            parse_as=TypeAdapter(list[Device]),
        )

    def get_device_by_id(self, device_id: str, create_if_not_exist=False):
        return self.__get("/devices", {"deviceId": device_id}, parse_as=Device)

    def get_all_devices_by_project_id(self, project_id: str):
        return self.__get(
            "/devices", {"projectId": project_id}, parse_as=TypeAdapter(list[Device])
        )

    """Measurement Endpoints"""

    def upload(
        self,
        *,
        name: str | None,
        test_id: str,
        device_id: str,
        data: dict,
    ):
        return self.__post(
            "/measurements",
            {
                "name": name,
                "testId": test_id,
                "deviceId": device_id,
                "data": json.dumps(data, encoder=NumpyEncoder),
            },
        )

    def get_all_measurements_by_test_id(
        self, test_id: str, start_date: datetime.datetime, end_date: datetime.datetime
    ):
        return self.__get(
            "/measurements",
            {
                "testId": test_id,
                "startDate": start_date.isoformat(),
                "endDate": end_date.isoformat(),
            },
            parse_as=TypeAdapter(list[Measurement]),
        )

    """Project Routes"""

    def create_project(self, name: str, workspace_id: str):
        return self.__post(
            "/projects", {"name": name, "workspaceId": workspace_id}, parse_as=Project
        )

    def get_project_by_id(self, project_id: str):
        return self.__get("/projects", {"projectId": project_id}, parse_as=Project)

    def get_all_projects_by_workspace_id(self, workspace_id: str):
        return self.__get(
            "/projects",
            {"workspaceId": workspace_id},
            parse_as=TypeAdapter(list[Project]),
        )

    """Workspace Routes"""

    def create_workspace(self, name: str):
        return self.__post("/workspaces", {"name": name}, parse_as=Workspace)

    def update_workspace(self, workspace_id: str, name: str):
        return self.__patch(
            "/workspaces",
            {"id": workspace_id, "name": name},
            parse_as=Workspace,
        )

    def delete_workspace_by_id(self, workspace_id: str):
        return self.__delete(
            "/workspaces",
            {"id": workspace_id},
        )

    def get_all_workspaces(self):
        return self.__get("/workspaces", {}, parse_as=TypeAdapter(list[Workspace]))

    def get_workspace_by_id(self, workspace_id: str):
        return self.__get(
            "/workspaces", {"workspaceId": workspace_id}, parse_as=Workspace
        )
