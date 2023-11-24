from captain.internal.wsmanager import ConnectionManager
from captain.utils.blocks_path import get_blocks_path
from captain.utils.logger import logger
from watchfiles import awatch


class BlocksWatcher:
    def __init__(self) -> None:
        self.ws = ConnectionManager.get_instance()

    async def run(self):
        blocks_path = get_blocks_path()
        logger.info(f"Starting file watcher for blocks dir {blocks_path}")

        async for change in awatch(blocks_path):
            logger.info(f"Detected {len(change)} file changes in {blocks_path}..")
            if self.ws.active_connections_map:
                await self.ws.broadcast({"type": "manifest_update"})
