import datetime
import json
import os
from typing import Callable, Literal, Optional, ParamSpec, TypeVar, Union, overload
from typing_extensions import Annotated

import numpy as np
import httpx
from pydantic import BaseModel, ConfigDict, Field, TypeAdapter
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
    model_config = ConfigDict(alias_generator=to_camel, protected_namespaces=())
    id: str
    created_at: datetime.datetime


class SystemModelPart(BaseModel):
    modelId: str
    count: int
    name: str


class Model(CloudModel):
    name: str
    workspace_id: str


class DeviceModel(Model):
    type: Literal["device"]


class SystemModel(Model):
    type: Literal["system"]
    parts: list[SystemModelPart]


class SystemPart(BaseModel):
    id: str
    name: str
    model: Model


class Hardware(CloudModel):
    name: str
    updated_at: Optional[datetime.datetime]
    workspace_id: str
    model_id: str
    model: Model


class Device(Hardware):
    type: Literal["device"]


class System(Hardware):
    type: Literal["system"]
    parts: list[SystemPart]


StorageProvider = Literal["s3", "local"]


class Measurement(CloudModel):
    name: str
    hardware_id: str
    test_id: str
    measurement_type: MeasurementType
    storage_provider: StorageProvider
    data: dict
    is_deleted: bool


class MeasurementWithHardware(Measurement):
    hardware: Hardware


class HardwareWithMeasurements(Hardware):
    measurements: list[MeasurementWithHardware]


class Test(CloudModel):
    name: str
    updated_at: Optional[datetime.datetime]
    measurement_type: MeasurementType
    project_id: str


class TestWithMeasurements(Test):
    measurements: list[MeasurementWithHardware]


class Project(CloudModel):
    name: str
    updated_at: Optional[datetime.datetime]
    workspace_id: str
    model_id: str


class ProjectWithModel(Project):
    model: Model


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

    @query(model=TestWithMeasurements)
    def get_test_by_id(self, test_id: str):
        return self.client.get(f"/tests/{test_id}")

    @query(model=TypeAdapter(list[Test]))
    def get_all_tests_by_project_id(self, project_id: str):
        return self.client.get(
            "/tests",
            params={"projectId": project_id},
        )

    @query(model=None)
    def update_test(
        self,
        name: str,
        test_id: str,
    ):
        return self.client.patch(f"/tests/{test_id}", json={"name": name})

    @query(model=None)
    def delete_test(self, test_id: str):
        return self.client.delete(f"/tests/{test_id}")

    """Model Endpoints"""

    @query(model=DeviceModel)
    def create_device_model(self, name: str):
        return self.client.post("/models/devices", json={"name": name})

    @query(model=SystemModel)
    def create_system_model(self, name: str):
        return self.client.post("/models/systems", json={"name": name})

    @query(
        model=TypeAdapter(
            list[
                Annotated[Union[DeviceModel, SystemModel], Field(discriminator="type")]
            ]
        )
    )
    def get_all_models(self):
        return self.client.get("/models")

    @query(model=TypeAdapter(list[DeviceModel]))
    def get_all_device_models(self):
        return self.client.get("/models/devices")

    @query(model=TypeAdapter(list[SystemModel]))
    def get_all_system_models(self):
        return self.client.get("/models/systems")

    """Hardware Endpoints"""

    @query(model=Hardware)
    def create_device(self, name: str, model_id: str, project_id: str):
        return self.client.post(
            "/hardware/devices",
            json={"name": name, "projectId": project_id, "modelId": model_id},
        )

    @query(model=Hardware)
    def create_system(
        self, name: str, model_id: str, device_ids: list[str], project_id: str
    ):
        return self.client.post(
            "/hardware/systems",
            json={
                "name": name,
                "projectId": project_id,
                "deviceIds": device_ids,
                "modelId": model_id,
            },
        )

    @query(model=HardwareWithMeasurements)
    def get_hardware_by_id(self, hardware_id: str):
        return self.client.get(f"/hardware/{hardware_id}")

    @query(model=TypeAdapter(list[Hardware]))
    def get_all_hardware(
        self,
        workspace_id: str,
        project_id: Optional[str] = None,
        only_available: bool = False,
    ):
        params = {"workspaceId": workspace_id, "onlyAvailable": only_available}
        if project_id is not None:
            params["projectId"] = project_id

        return self.client.get("/hardware", params=params)

    @query(model=TypeAdapter(list[Device]))
    def get_all_devices(
        self,
        workspace_id: str,
        project_id: Optional[str] = None,
        only_available: bool = False,
    ):
        params = {"workspaceId": workspace_id, "onlyAvailable": only_available}
        if project_id is not None:
            params["projectId"] = project_id

        return self.client.get("/hardware/devices", params=params)

    @query(model=TypeAdapter(list[System]))
    def get_all_systems(
        self,
        workspace_id: str,
        project_id: Optional[str] = None,
    ):
        params = {"workspaceId": workspace_id}
        if project_id is not None:
            params["projectId"] = project_id

        return self.client.get("/hardware/systems", params=params)

    @query(model=None)
    def delete_device_by_id(self, hardware_id: str):
        return self.client.delete(f"/hardware/{hardware_id}")

    """Measurement Endpoints"""

    @query(model=None)
    def upload(
        self,
        data: MeasurementData,
        test_id: str,
        hardware_id: str,
        name: str | None = None,
        created_at: datetime.datetime | None = None,
    ):
        body = {
            "testId": test_id,
            "hardwareId": hardware_id,
            "data": data.model_dump(),
        }
        if name is not None:
            body["name"] = name
        if created_at is not None:
            body["createdAt"] = created_at.isoformat()

        return self.client.post(
            "/measurements",
            content=json.dumps(body, cls=NumpyEncoder),
            headers={
                "Content-Type": "application/json",
            },
        )

    @query(model=TypeAdapter(list[MeasurementWithHardware]))
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

    @query(model=MeasurementWithHardware)
    def get_measurement_by_id(self, measurement_id: str):
        return self.client.get(f"/measurements/{measurement_id}")

    """Project Routes"""

    @query(model=Project)
    def create_project(self, name: str, model_id: str, workspace_id: str):
        return self.client.post(
            "/projects",
            json={"name": name, "modelId": model_id, "workspaceId": workspace_id},
        )

    @query(model=ProjectWithModel)
    def get_project_by_id(self, project_id: str):
        return self.client.get(f"/projects/{project_id}")

    @query(model=TypeAdapter(list[Project]))
    def get_all_projects_by_workspace_id(self, workspace_id: str):
        return self.client.get(
            "/projects",
            params={"workspaceId": workspace_id},
        )

    @query(model=None)
    def add_device_to_project(self, hardware_id: str, project_id: str):
        return self.client.put(
            f"/projects/{project_id}/hardware/{hardware_id}",
        )

    @query(model=None)
    def remove_device_from_project(self, hardware_id: str, project_id: str):
        return self.client.delete(
            f"/projects/{project_id}/hardware/{hardware_id}",
        )

    @query(model=None)
    def update_project(self, name: str, project_id: str):
        return self.client.patch(f"/projects/{project_id}", json={"name": name})

    @query(model=None)
    def delete_project(self, project_id: str):
        return self.client.delete(f"/projects/{project_id}")
