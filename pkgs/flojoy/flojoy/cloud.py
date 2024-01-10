import datetime
import json
import os
from typing import Callable, Literal, Optional, ParamSpec, TypeVar, overload

import numpy as np
import httpx
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


class Workspace(CloudModel):
    name: str
    plan_type: PlanType
    total_seats: int
    updated_at: Optional[datetime.datetime]


class FlojoyCloudException(Exception):
    pass


T = TypeVar("T", bound=BaseModel)
U = TypeVar("U")
P = ParamSpec("P")


@overload
def query(
    model: None,
) -> Callable[[Callable[P, httpx.Response]], Callable[P, None]]:
    ...


@overload
def query(
    model: type[T],
) -> Callable[[Callable[P, httpx.Response]], Callable[P, T]]:
    ...


@overload
def query(
    model: TypeAdapter[U],
) -> Callable[[Callable[P, httpx.Response]], Callable[P, U]]:
    ...


def query(
    model: type[T] | TypeAdapter[U] | None,
) -> Callable[[Callable[P, httpx.Response]], Callable[P, T | U | None]]:
    def decorator(func: Callable[P, httpx.Response]):
        def wrapper(*args: P.args, **kwargs: P.kwargs):
            res = func(*args, **kwargs)

            if res.status_code >= 400:
                error_json = json.loads(res.text)
                raise FlojoyCloudException(
                    f"An exception occurred when making a request\n "
                    f"{error_json['code']}: {error_json['message']}"
                )
            if model is None:
                return None

            match model:
                case TypeAdapter():
                    return model.validate_json(res.text)
                case _:
                    return model.model_validate_json(res.text)

        return wrapper

    return decorator


class FlojoyCloud:
    client: httpx.Client

    def __init__(
        self,
        workspace_secret: Optional[str] = None,
        api_url="https://cloud.flojoy.ai/api/v1",
    ):
        if workspace_secret is None:
            env = os.environ.get("FLOJOY_CLOUD_WORKSPACE_SECRET")
            if env is None:
                raise EnvironmentError(
                    "Flojoy Cloud workspace secret not set, and no 'FLOJOY_CLOUD_WORKSPACE_SECRET' environment variable was found."
                )
            workspace_secret = env
        self.base_url = api_url
        self.client = httpx.Client(
            base_url=api_url,
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {workspace_secret}",
            },
        )

    """Test Endpoints"""

    @query(model=Test)
    def create_test(
        self, name: str, project_id: str, measurement_type: MeasurementType
    ):
        return self.client.post(
            "/tests",
            json={
                "name": name,
                "projectId": project_id,
                "measurementType": measurement_type,
            },
        )

    @query(model=Test)
    def get_test_by_id(self, test_id: str):
        return self.client.get(f"/tests/{test_id}")

    @query(model=TypeAdapter(list[Test]))
    def get_all_tests_by_project_id(self, project_id: str):
        return self.client.get(
            "/tests",
            params={"projectId": project_id},
        )

    """Device Endpoints"""

    @query(model=Device)
    def create_device(self, name: str, project_id: str):
        return self.client.post(
            "/devices",
            json={"name": name, "projectId": project_id},
        )

    @query(model=Device)
    def get_device_by_id(self, device_id: str):
        return self.client.get(f"/devices/{device_id}")

    @query(model=TypeAdapter(list[Device]))
    def get_all_devices(self, workspace_id: str, project_id: Optional[str] = None):
        params = {"workspaceId": workspace_id}
        if project_id is not None:
            params["projectId"] = project_id

        return self.client.get("/devices", params=params)

    @query(model=Device)
    def delete_device_by_id(self, device_id: str):
        return self.client.delete(f"/devices/{device_id}")

    """Measurement Endpoints"""

    @query(model=None)
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

        return self.client.post(
            "/measurements",
            content=json.dumps(body, cls=NumpyEncoder),
        )

    @query(model=TypeAdapter(list[Measurement]))
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

        return self.client.get(
            "/measurements",
            params=query_params,
        )

    """Project Routes"""

    @query(model=Project)
    def create_project(self, name: str, workspace_id: str):
        return self.client.post(
            "/projects",
            json={"name": name, "workspaceId": workspace_id},
        )

    @query(model=Project)
    def get_project_by_id(self, project_id: str):
        return self.client.get(f"/projects/{project_id}")

    @query(model=TypeAdapter(list[Project]))
    def get_all_projects_by_workspace_id(self, workspace_id: str):
        return self.client.get(
            "/projects",
            params={"workspaceId": workspace_id},
        )

    @query(model=None)
    def add_device_to_project(self, device_id: str, project_id: str):
        return self.client.put(
            f"/projects/{project_id}/devices/add/{device_id}",
        )

    @query(model=None)
    def remove_device_from_project(self, device_id: str, project_id: str):
        return self.client.delete(
            f"/projects/{project_id}/devices/remove/{device_id}",
        )

    """Workspace Routes"""

    @query(model=None)
    def update_workspace(self, workspace_id: str, name: str):
        return self.client.patch(
            f"/workspaces/{workspace_id}",
            json={"name": name},
        )

    @query(model=None)
    def delete_workspace_by_id(self, workspace_id: str):
        return self.client.delete(f"/workspaces/{workspace_id}")

    @query(model=TypeAdapter(list[Workspace]))
    def get_all_workspaces(self):
        return self.client.get("/workspaces")

    @query(model=Workspace)
    def get_workspace_by_id(self, workspace_id: str):
        return self.client.get(f"/workspaces/{workspace_id}")
