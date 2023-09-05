from fastapi import APIRouter, Response
from captain.utils.manifest.generate_manifest import generate_manifest
from captain.utils.nodes_metadata import generate_metadata
import json

router = APIRouter(tags=["nodes"])


@router.get("/nodes/manifest/")
async def get_manifest():
    try:
        manifest = generate_manifest()
        return manifest
    except Exception as e:
        return Response(
            status_code=400,
            content=json.dumps({"success": False, "error": "\n".join(e.args)}),
        )


@router.get("/nodes/metadata/")
async def get_metadata():
    try:
        metadata_map = generate_metadata()
        return metadata_map
    except Exception as e:
        return Response(
            status_code=400,
            content=json.dumps({"success": False, "error": "\n".join(e.args)}),
        )
