import json

from fastapi import APIRouter, Response

from captain.internal.manager import WatchManager
from captain.utils.manifest.generate_manifest import generate_manifest
from captain.utils.blocks_metadata import generate_metadata
from captain.utils.import_blocks import create_map
from captain.utils.logger import logger

router = APIRouter(tags=["blocks"])


@router.get("/blocks/manifest/")
async def get_manifest(blocks_path: str | None = None):
    # Pre-generate the blocks map to synchronize it with the manifest
    create_map(custom_blocks_dir=blocks_path)
    try:
        manifest = generate_manifest(blocks_path=blocks_path)
        return manifest
    except Exception as e:
        logger.error(
            f"error in get_manifest(): {e} traceback: {e.with_traceback(e.__traceback__)}"
        )
        return Response(
            status_code=400,
            content=json.dumps({"success": False, "error": "\n".join(e.args)}),
        )


@router.get("/blocks/metadata/")
async def get_metadata(
    blocks_path: str | None = None, custom_dir_changed: bool = False
):
    try:
        metadata_map = generate_metadata(custom_blocks_dir=blocks_path)
        if custom_dir_changed:
            watch_manager = WatchManager.get_instance()
            watch_manager.restart()
        return metadata_map
    except Exception as e:
        logger.error(
            f"error in get_metadata(): {e}, traceback: {e.with_traceback(e.__traceback__)}"
        )
        return Response(
            status_code=400,
            content=json.dumps({"success": False, "error": "\n".join(e.args)}),
        )
