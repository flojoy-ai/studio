import json
import logging
import requests
from fastapi import APIRouter, Header, Response
from flojoy.env_var import get_env_var, get_flojoy_cloud_url
from flojoy_cloud import test_sequencer
from pydantic import BaseModel, Field
from typing import Annotated, Optional
import datetime
from typing import Literal
import pandas as pd
from functools import wraps


# Utils ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


def utcnow_str() -> str:
    return datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%S.%fZ")


def temporary_cache(*args, ttl=20):
    """A decorator that ensures that the result of the function call
    is cached for `ttl` seconds (default: 20).

    Warning: The returned object is stored directly, mutating it also mutates the
    cached object. Make a copy if you want to avoid that.
    """

    def decorator(func):
        func.cache = None
        func.cache_time = datetime.datetime.fromordinal(1)

        @wraps(func)
        def inner(*args, **kwargs):
            if (
                (now := datetime.datetime.now()) - func.cache_time
            ).total_seconds() > ttl:
                func.cache = func(*args, **kwargs)
                func.cache_time = now
            return func.cache

        return inner

    if len(args) == 1 and callable(args[0]):
        return decorator(args[0])
    elif args:
        raise ValueError("Must supply the decorator arguments as keywords.")
    return decorator


async def get_cloud_part_variation(part_variation_id: str):
    logging.info("Querying part variation")
    url = get_flojoy_cloud_url() + "partVariation/" + part_variation_id
    response = requests.get(url, headers=headers_builder())
    res = response.json()
    res["partVariationId"] = part_variation_id
    logging.info("Part variation retrieved: %s", res)
    return PartVariation(**res)


class SecretNotFound(Exception):
    pass


def error_response_builder(e: Exception) -> Response:
    logging.error(f"Error from Flojoy Cloud: {e}")
    if isinstance(e, SecretNotFound):
        return Response(status_code=401, content=json.dumps([]))
    else:
        return Response(status_code=500, content=json.dumps([]))


@temporary_cache
def headers_builder(with_workspace_id=True) -> dict:
    workspace_secret = get_env_var("FLOJOY_CLOUD_WORKSPACE_SECRET")
    logging.info("Querying workspace current")
    if workspace_secret is None:
        raise SecretNotFound
    headers = {
        "Content-Type": "application/json",
        "flojoy-workspace-personal-secret": workspace_secret,
    }
    if with_workspace_id:
        url = get_flojoy_cloud_url() + "workspace/"
        response = requests.get(url, headers=headers)
        if response.status_code != 200:
            logging.error(f"Failed to get workspace id {url}: {response.text}")
            raise Exception("Failed to get workspace id")
        workspace_id = response.json()[0]["id"]
        headers["flojoy-workspace-id"] = workspace_id
    return headers


class CloudModel(BaseModel):
    id: str
    created_at: str = Field(..., alias="createdAt")
    workspace_id: str = Field(..., alias="workspaceId")


class Project(CloudModel):
    name: str
    updated_at: Optional[datetime.datetime] = Field(..., alias="updatedAt")
    part_variation_id: str = Field(..., alias="partVariationId")
    repo_url: Optional[str] = Field(..., alias="repoUrl")


class Part(CloudModel):
    name: str
    product_name: str = Field(..., alias="productName")
    description: str


class Product(CloudModel):
    name: str
    description: str


class Station(BaseModel):
    id: str
    created_at: str = Field(..., alias="createdAt")
    name: str


class PartVariation(CloudModel):
    part_id: str = Field(..., alias="partId")
    part_variation_id: str = Field(..., alias="partVariationId")
    part_number: str = Field(..., alias="partNumber")
    description: str


class Unit(CloudModel):
    serial_number: str = Field(..., alias="serialNumber")
    lot_number: Optional[str] = Field(..., alias="lotNumber")
    parent: Optional[str]
    part_variation_id: str = Field(..., alias="partVariationId")


class Measurement(BaseModel):
    test_id: str = Field(..., alias="testId")
    sequence_name: str = Field(..., alias="sequenceName")
    cycle_number: int = Field(..., alias="cycleNumber")
    name: str
    pass_: Optional[bool]
    completion_time: float = Field(..., alias="completionTime")
    created_at: str = Field(..., alias="createdAt")


class Session(BaseModel):
    serial_number: str = Field(..., alias="serialNumber")
    station_id: str = Field(..., alias="stationId")
    integrity: bool
    aborted: bool
    notes: str
    commit_hash: str = Field(..., alias="commitHash")
    measurements: list[Measurement]


MeasurementData = bool | pd.DataFrame | int | float
MeasurementType = Literal["boolean", "dataframe", "scalar"]


def make_payload(data: MeasurementData):
    match data:
        case bool():
            return {"type": "boolean", "value": data}
        case pd.DataFrame():
            value = {}
            # Have to do this weird hack because df.todict('list') behaves strangely
            for col_name, series in data.items():
                value[col_name] = series.tolist()

            return {"type": "dataframe", "value": value}
        case int() | float():
            return {"type": "scalar", "value": data}
        case _:
            raise TypeError(f"Unsupported data type: {type(data)}")


def get_measurement(m: Measurement) -> MeasurementData:
    data = test_sequencer._get_most_recent_data(m.test_id)
    if not isinstance(data, MeasurementData):
        logging.info(f"{m.test_id}: Unexpected data type for test data: {type(data)}")
        data = m.pass_
    return data


async def get_part(part_id: str) -> Part:
    logging.info("Querying part")
    url = get_flojoy_cloud_url() + "part/" + part_id
    response = requests.get(url, headers=headers_builder())
    logging.info("Part retrieved: %s", response.json())
    return Part(**response.json())


# Routes ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


router = APIRouter(tags=["cloud"])


@router.get("/cloud/projects/")
async def get_cloud_projects():
    """
    Get all projects from the Flojoy Cloud.
    """
    try:
        logging.info("Querying projects")
        url = get_flojoy_cloud_url() + "project/"
        response = requests.get(url, headers=headers_builder())
        if response.status_code != 200:
            return Response(status_code=response.status_code, content=json.dumps([]))
        logging.info("Projects retrieved: %s", response.json())
        projects = [Project(**project_data) for project_data in response.json()]
        logging.info("Projects: %s", projects)
        projects_res = []
        for p in projects:
            part_var = await get_cloud_part_variation(p.part_variation_id)
            part = await get_part(part_var.part_id)
            projects_res.append(
                {
                    "label": p.name,
                    "value": p.id,
                    "part": part_var.model_dump(by_alias=True),
                    "repoUrl": p.repo_url,
                    "productName": part.product_name,
                }
            )
        return Response(
            status_code=200,
            content=json.dumps(projects_res),
        )
    except Exception as e:
        return error_response_builder(e)


@router.get("/cloud/stations/{project_id}")
async def get_cloud_stations(project_id: str):
    """
    Get all station of a project from the Flojoy Cloud.
    """
    try:
        logging.info("Querying stations")
        url = get_flojoy_cloud_url() + "station/"
        querystring = {"projectId": project_id}
        response = requests.get(url, headers=headers_builder(), params=querystring)
        if response.status_code != 200:
            logging.error(f"Error getting stations from Flojoy Cloud: {response.text}")
            return Response(status_code=response.status_code, content=json.dumps([]))
        logging.info("Stations retrieved: %s", response.json())
        stations = [Station(**s) for s in response.json()]
        logging.info("Stations: %s", stations)
        if not stations:
            return Response(status_code=404, content=json.dumps([]))
        return Response(
            status_code=200,
            content=json.dumps([{"label": p.name, "value": p.id} for p in stations]),
        )
    except Exception as e:
        return error_response_builder(e)


@router.get("/cloud/partVariation/{part_var_id}/unit")
async def get_cloud_variant_unit(part_var_id: str):
    try:
        logging.info(f"Querying unit for part {part_var_id}")
        url = f"{get_flojoy_cloud_url()}partVariation/{part_var_id}/unit"
        response = requests.get(url, headers=headers_builder())
        if response.status_code != 200:
            logging.error(f"Error getting stations from Flojoy Cloud: {response.text}")
            return Response(status_code=response.status_code, content=json.dumps([]))
        units = [Unit(**u) for u in response.json()]
        if not units:
            return Response(status_code=404, content=json.dumps([]))
        dict_model = [unit.model_dump(by_alias=True) for unit in units]
        return Response(status_code=200, content=json.dumps(dict_model))
    except Exception as e:
        return error_response_builder(e)


@router.post("/cloud/session/")
async def post_cloud_session(_: Response, body: Session):
    try:
        logging.info("Posting session")
        url = get_flojoy_cloud_url() + "session/"
        payload = body.model_dump(by_alias=True)
        payload["createdAt"] = utcnow_str()
        for i, m in enumerate(payload["measurements"]):
            m["data"] = make_payload(get_measurement(body.measurements[i]))
            m["pass"] = m.pop("pass_")
            m["durationMs"] = int(m.pop("completionTime") * 1000)
        response = requests.post(url, json=payload, headers=headers_builder())
        if response.status_code == 200:
            return Response(status_code=200, content=json.dumps(response.json()))
        else:
            logging.error(
                f"Failed to post session. Status code: {response.status_code}, Response: {response.text}"
            )
            return Response(status_code=response.status_code, content=json.dumps([]))
    except Exception as e:
        return error_response_builder(e)


@router.get("/cloud/user/")
async def get_user_info(secret: Annotated[str | None, Header()]):
    try:
        logging.info("Querying user info")
        url = get_flojoy_cloud_url() + "user/"
        headers = (
            {"flojoy-workspace-personal-secret": secret}
            if secret
            else headers_builder(with_workspace_id=False)
        )
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            return Response(status_code=200, content=json.dumps(response.json()))
        else:
            logging.error(
                f"Failed to get user info. Status code: {response.status_code}, Response: {response.text}"
            )
            return Response(status_code=response.status_code, content=json.dumps([]))
    except Exception as e:
        return error_response_builder(e)


@router.get("/cloud/health/")
async def get_cloud_health(url: Annotated[str | None, Header()]):
    try:
        logging.info("Querying health")
        if url is None:
            url = get_flojoy_cloud_url()
        url = url + "health/"
        response = requests.get(url)
        if response.status_code == 200:
            return Response(status_code=200)
        else:
            logging.error(
                f"Failed to get health. Status code: {response.status_code}, Response: {response.text}"
            )
            return Response(status_code=response.status_code, content=json.dumps([]))
    except Exception as e:
        return error_response_builder(e)
