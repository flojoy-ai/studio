import json

from fastapi import APIRouter, Response
from flojoy_cloud.client import FlojoyCloud
from flojoy.env_var import get_env_var

router = APIRouter(tags=["cloud"])


@router.get("/cloud/projects/")
async def get_cloud_projects():
    """
    Get all projects from the Flojoy Cloud.
    """
    workspace_secret = get_env_var("FLOJOY_CLOUD_WORKSPACE_SECRET")
    if workspace_secret is None:
        return Response(status_code=401, content=json.dumps([]))

    cloud = FlojoyCloud(workspace_secret=get_env_var("FLOJOY_CLOUD_WORKSPACE_SECRET"))

    projects = cloud.get_all_projects(
        ""
    )  # TODO: Update `get_all_projects` to not require a workspace ID

    if not projects:
        return Response(status_code=404, content=json.dumps([]))
    return Response(
        status_code=200,
        content=json.dumps([{"label": p.name, "value": p.id} for p in projects]),
    )
