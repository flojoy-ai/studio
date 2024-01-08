import datetime
import json
import os
from typing import Literal, Optional, TypeVar, overload

import numpy as np
import requests
import urllib.parse
from pydantic import BaseModel, ConfigDict, TypeAdapter
from pydantic.alias_generators import to_camel


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


MeasurementType = Literal["boolean", "dataframe"]


class Boolean(BaseModel):
    type: Literal["boolean"] = "boolean"
    passed: bool


class Dataframe(BaseModel):
    type: Literal["dataframe"] = "dataframe"
    dataframe: dict


MeasurementData = Boolean | Dataframe


T = TypeVar("T", bound=BaseModel)
U = TypeVar("U")


class CloudModel(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel)
    id: str
    created_at: datetime.datetime


class Device(CloudModel):
    name: str
    updated_at: Optional[datetime.datetime]
    project_id: str


StorageProvider = Literal["s3", "local"]


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
    updated_at: Optional[datetime.datetime]
    measurement_type: MeasurementType
    project_id: str


class Project(CloudModel):
    name: str
    updated_at: Optional[datetime.datetime]
    workspace_id: str


PlanType = Literal["hobby", "pro", "enterprise"]
HttpMethod = Literal["GET", "POST", "PUT", "PATCH", "DELETE"]


class Workspace(CloudModel):
    name: str
    plan_type: PlanType
    total_seats: int
    updated_at: Optional[datetime.datetime]


class FlojoyCloudException(Exception):
    pass


class FlojoyCloud:
    auth: str
    base_url: str

    def __init__(
        self, api_key: Optional[str] = None, api_url="https://cloud.flojoy.ai/api/v1"
    ):
        if api_key is None:
            env = os.environ.get("FLOJOY_CLOUD_API_KEY")
            if env is None:
                raise EnvironmentError(
                    "Flojoy Cloud API key not set, and no 'FLOJOY_CLOUD_API_KEY' environment variable was found."
                )
            api_key = env
        self.auth = f"Bearer {api_key}"
        self.base_url = api_url

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
    def __req(
        self,
        method: HttpMethod,
        endpoint: str,
        *,
        query_params: dict[str, int | str] | None = None,
        data: str | None = None,
        body: dict | None = None,
        parse_as: type[T],
    ) -> T:
        ...

    @overload
    def __req(
        self,
        method: HttpMethod,
        endpoint: str,
        *,
        query_params: dict[str, int | str] | None = None,
        data: str | None = None,
        body: dict | None = None,
        parse_as: TypeAdapter[U],
    ) -> U:
        ...

    @overload
    def __req(
        self,
        method: HttpMethod,
        endpoint: str,
        *,
        query_params: dict[str, int | str] | None = None,
        data: str | None = None,
        body: dict | None = None,
        parse_as: None = None,
    ) -> None:
        ...

    def __req(
        self,
        method: HttpMethod,
        endpoint: str,
        *,
        query_params: dict[str, int | str] | None = None,
        data: str | None = None,
        body: dict | None = None,
        parse_as: type[T] | TypeAdapter[U] | None = None,
    ) -> T | U | None:
        res = requests.request(
            method,
            self.base_url + endpoint,
            params=query_params,
            data=data,
            json=body,
            headers={"Authorization": self.auth, "Content-Type": "application/json"},
        )

        if res.status_code >= 400:
            error_json = json.loads(res.text)
            raise FlojoyCloudException(
                f"An exception occurred when making a request to {endpoint}\n "
                f"{error_json['code']}: {error_json['message']}"
            )

        if parse_as is None:
            return None

        return self.__parse(parse_as, res.text)

    """Test Endpoints"""

    def create_test(
        self, name: str, project_id: str, measurement_type: MeasurementType
    ) -> Test:
        return self.__req(
            "POST",
            "/tests",
            body={
                "name": name,
                "projectId": project_id,
                "measurementType": measurement_type,
            },
            parse_as=Test,
        )

    def get_test_by_id(self, test_id: str):
        return self.__req("GET", f"/tests/{test_id}", parse_as=Test)

    def get_all_tests_by_project_id(self, project_id: str):
        return self.__req(
            "GET",
            "/tests",
            query_params={"projectId": project_id},
            parse_as=TypeAdapter(list[Test]),
        )

    """Device Endpoints"""

    def create_device(self, name: str, project_id: str):
        return self.__req(
            "POST",
            "/devices",
            body={"name": name, "projectId": project_id},
            parse_as=Device,
        )

    def get_device_by_id(self, device_id: str):
        return self.__req("GET", f"/devices/{device_id}", parse_as=Device)

    def get_all_devices_by_project_id(self, project_id: str):
        return self.__req(
            "GET",
            "/devices",
            query_params={"projectId": project_id},
            parse_as=TypeAdapter(list[Device]),
        )

    def delete_device_by_id(self, device_id: str):
        return self.__req("DELETE", f"/devices/{device_id}", parse_as=Device)

    """Measurement Endpoints"""

    # TODO: Fix
    def upload(
        self,
        data: MeasurementData,
        test_id: str,
        device_id: str,
        name: str | None = None,
        created_at: datetime.datetime | None = None,
    ):
        body = {
            "testId": test_id,
            "deviceId": device_id,
            "data": data.model_dump(),
            "measurementType": data.type,
        }
        if name is not None:
            body["name"] = name
        if created_at is not None:
            body["createdAt"] = created_at.isoformat()

        return self.__req(
            "POST",
            "/measurements",
            data=json.dumps(body, cls=NumpyEncoder),
        )

    def get_all_measurements_by_test_id(
        self,
        test_id: str,
        start_date: datetime.datetime | None = None,
        end_date: datetime.datetime | None = None,
    ):
        query_params: dict[str, int | str] = {
            "testId": test_id,
        }
        if start_date is not None:
            query_params["startDate"] = start_date.isoformat()
        if end_date is not None:
            query_params["endDate"] = end_date.isoformat()

        return self.__req(
            "GET",
            "/measurements",
            query_params=query_params,
            parse_as=TypeAdapter(list[Measurement]),
        )

    """Project Routes"""

    def create_project(self, name: str, workspace_id: str):
        return self.__req(
            "POST",
            "/projects",
            body={"name": name, "workspaceId": workspace_id},
            parse_as=Project,
        )

    def get_project_by_id(self, project_id: str):
        return self.__req("GET", f"/projects/{project_id}", parse_as=Project)

    def get_all_projects_by_workspace_id(self, workspace_id: str):
        return self.__req(
            "GET",
            "/projects",
            query_params={"workspaceId": workspace_id},
            parse_as=TypeAdapter(list[Project]),
        )

    """Workspace Routes"""

    def update_workspace(self, workspace_id: str, name: str):
        return self.__req(
            "PATCH",
            f"/workspaces/{workspace_id}",
            body={"name": name},
        )

    def delete_workspace_by_id(self, workspace_id: str):
        return self.__req(
            "DELETE",
            f"/workspaces/{workspace_id}",
        )

    def get_all_workspaces(self):
        return self.__req("GET", "/workspaces", parse_as=TypeAdapter(list[Workspace]))

    def get_workspace_by_id(self, workspace_id: str):
        return self.__req("GET", f"/workspaces/{workspace_id}", parse_as=Workspace)
