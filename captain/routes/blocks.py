import json

from fastapi import APIRouter, Response

from captain.utils.manifest.generate_manifest import generate_manifest
from captain.utils.blocks_metadata import generate_metadata
from captain.utils.import_blocks import create_map

router = APIRouter(tags=["blocks"])


@router.get("/blocks/manifest/")
async def get_manifest():
    # Pre-generate the blocks map to synchronize it with the manifest
    create_map()
    try:
        manifest = generate_manifest()
        return manifest
    except Exception as e:
        return Response(
            status_code=400,
            content=json.dumps({"success": False, "error": "\n".join(e.args)}),
        )


@router.get("/blocks/metadata/")
async def get_metadata():
    try:
        metadata_map = generate_metadata()
        return metadata_map
    except Exception as e:
        return Response(
            status_code=400,
            content=json.dumps({"success": False, "error": "\n".join(e.args)}),
        )
