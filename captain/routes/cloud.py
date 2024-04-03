import json
import logging
import requests
from fastapi import APIRouter, Response
from flojoy.env_var import get_env_var, get_flojoy_cloud_url
from flojoy_cloud.client import FlojoyCloud
from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel
from typing import Optional
import datetime


router = APIRouter(tags=["cloud"])


@router.get("/cloud/projects/")
async def get_cloud_projects():
    """
    Get all projects from the Flojoy Cloud.
    """
    try:
        logging.info("Querying projects")
        url = get_flojoy_cloud_url() + "project/"
        response = requests.get(url, headers=build_headers())
        if response.status_code != 200:
            return Response(status_code=response.status_code, content=json.dumps([]))
        projects = [Project(**project_data) for project_data in response.json()]
        content=json.dumps([{
                "label": p.name, "value": p.id, "part": await get_cloud_part_variation(p.part_variation_id)
            } for p in projects])
        logging.info(content)
        return Response(
            status_code=200,
            content=json.dumps([{
                "label": p.name, "value": p.id, "part": await get_cloud_part_variation(p.part_variation_id)
            } for p in projects]),
        )
    except Exception as e:
        return error_response(e)


@router.get("/cloud/stations/{project_id}")
async def get_cloud_stations(project_id: str):
    """
    Get all station of a project from the Flojoy Cloud.
    """
    try:
        logging.info("Querying stations")
        url = get_flojoy_cloud_url() + "station/"
        querystring = {"projectId": project_id}
        response = requests.get(url, headers=build_headers(), params=querystring)

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
        return error_response(e)


@router.get("/cloud/unit/SN/{serial_number}")
async def get_cloud_unit_SN(serial_number: str):
    try:
        raise NotImplemented
    except Exception as e:
        return error_response(e)



# Utils ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


async def get_cloud_part_variation(part_variation_id: str):
    logging.info("Querying part variation")
    url = get_flojoy_cloud_url() + "partVariation/" + part_variation_id
    response = requests.get(url, headers=build_headers())
    part_variation = PartVariation(**response.json())
    return part_variation.model_dump()


class SecretNotFound(Exception):
    pass


def error_response(e: Exception) -> Response:
    logging.error(f"Error getting projects from Flojoy Cloud: {e}")
    if isinstance(e, SecretNotFound):
        return Response(status_code=401, content=json.dumps([]))
    else:
        return Response(status_code=500, content=json.dumps([]))


def build_headers() -> dict:
    workspace_secret = get_env_var("FLOJOY_CLOUD_WORKSPACE_SECRET")
    if workspace_secret is None:
        raise SecretNotFound
    headers = {
        "Content-Type": "application/json",
        "flojoy-workspace-personal-access-token": workspace_secret,
        "flojoy-workspace-id": "workspace_ysva9vgxc5sn3ar8fg8kilv4",
    }
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
