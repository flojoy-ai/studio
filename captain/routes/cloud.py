import json
import logging
import requests
from fastapi import APIRouter, Response
from flojoy.env_var import get_env_var, get_flojoy_cloud_url
from flojoy_cloud import test_sequencer
from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel
from typing import Optional
import datetime
from typing import Literal
import pandas as pd


# Utils ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


async def get_cloud_part_variation(part_variation_id: str):
    logging.info("Querying part variation")
    url = get_flojoy_cloud_url() + "partVariation/" + part_variation_id
    response = requests.get(url, headers=headers_builder())
    part_variation = PartVariation(**response.json())
    return part_variation.model_dump()


class SecretNotFound(Exception):
    pass


def error_response_builder(e: Exception) -> Response:
    logging.error(f"Error from Flojoy Cloud: {e}")
    if isinstance(e, SecretNotFound):
        return Response(status_code=401, content=json.dumps([]))
    else:
        return Response(status_code=500, content=json.dumps([]))


def headers_builder(with_workspace_id=True) -> dict:
    workspace_secret = get_env_var("FLOJOY_CLOUD_WORKSPACE_SECRET")
    if workspace_secret is None:
        raise SecretNotFound
    headers = {
        "Content-Type": "application/json",
        "flojoy-workspace-personal-secret": workspace_secret,
    }
    if with_workspace_id:
        response = requests.get(get_flojoy_cloud_url() + "workspace/", headers=headers)
        if response.status_code != 200:
            logging.error(f"Failed to get workspace id: {response.text}")
            raise Exception("Failed to get workspace id")
        logging.info(response.json())
        workspace_id = response.json()[0]["id"]
        headers["flojoy-workspace-id"] = workspace_id
    return headers


class CamelModel(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, protected_namespaces=())


class CloudModel(CamelModel):
    id: str
    created_at: datetime.datetime


class Project(CloudModel):
    name: str
    updated_at: Optional[datetime.datetime]
    workspace_id: str
    part_variation_id: str
    repo_Url: Optional[str]


class Station(CloudModel):
    name: str


class PartVariation(BaseModel):
    partId: str
    partNumber: str
    description: str


class Measurement(BaseModel):
    testId: str
    sequenceName: str
    cycleNumber: int
    name: str
    pass_: Optional[bool]
    # createdAt: Optional[datetime.datetime]


class Session(BaseModel):
    serialNumber: str
    stationId: str
    integrity: bool
    aborted: bool
    notes: str
    commitHash: str
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
    data = test_sequencer._get_most_recent_data(m.testId)
    if not isinstance(data, MeasurementData):
        logging.info(
            f"{m.testId}: Unexpected data type for test data: {type(data)}"
        )
        data = m.pass_
    return data


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
        projects = [Project(**project_data) for project_data in response.json()]
        content = json.dumps([{"label": p.name, "value": p.id, "part": await get_cloud_part_variation(p.part_variation_id)} for p in projects])
        logging.info(content)
        return Response(
            status_code=200,
            content=json.dumps([{
                "label": p.name, "value": p.id, "part": await get_cloud_part_variation(p.part_variation_id)
            } for p in projects]),
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
        stations = [Station(**s) for s in response.json()]
        if not stations:
            return Response(status_code=404, content=json.dumps([]))
        return Response(
            status_code=200,
            content=json.dumps([{"label": p.name, "value": p.id} for p in stations]),
        )
    except Exception as e:
        return error_response_builder(e)


@router.get("/cloud/unit/SN/{serial_number}")
async def get_cloud_unit_SN(serial_number: str):
    try:
        raise NotImplementedError
    except Exception as e:
        return error_response_builder(e)


@router.post("/cloud/session/")
async def post_cloud_session(_: Response, body: Session):
    try:
        logging.info("Posting session")
        logging.info(body)
        url = get_flojoy_cloud_url() + "session/"
        payload = body.model_dump()
        for i, m in enumerate(payload["measurements"]):
            m["createdAt"] = "2024-04-03T23:47:57.593Z"
            m["data"] = make_payload(get_measurement(body.measurements[i]))
            m["pass"] = m.pop("pass_")
        response = requests.post(url, json=payload, headers=headers_builder())
        if response.status_code == 200:
            logging.info("Session posted successfully")
            return Response(status_code=200, content=json.dumps(response.json()))
        else:
            logging.error(f"Failed to post session. Status code: {response.status_code}, Response: {response.text}")
            return Response(status_code=response.status_code, content=json.dumps([]))
    except Exception as e:
        return error_response_builder(e)


