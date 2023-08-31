from fastapi import APIRouter
from captain.utils.manifest.generate_manifest import generate_manifest
from captain.utils.nodes_metadata import generate_metadata

router = APIRouter(tags=["nodes"])


@router.get("/nodes/manifest/")
async def get_manifest():
    return generate_manifest()


@router.get("/nodes/metadata/")
async def get_metadata():
    return generate_metadata()
