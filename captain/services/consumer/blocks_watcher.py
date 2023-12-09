from captain.internal.wsmanager import ConnectionManager
from captain.utils.blocks_path import get_blocks_path
from captain.utils.logger import logger
from watchfiles import awatch
from pathlib import Path


class BlocksWatcher:
    def __init__(self) -> None:
        self.ws = ConnectionManager.get_instance()

    async def run(self):
        blocks_path = get_blocks_path()
        paths_to_watch = [blocks_path]

        custom_path_file = Path.home() / ".flojoy" / "custom_blocks_path.txt"
        if Path.exists(custom_path_file):
            with open(custom_path_file) as f:
                paths_to_watch.append(f.read())

        logger.info(f"Starting file watcher for blocks dirs {paths_to_watch}")

        async for change in awatch(*paths_to_watch):
            logger.info(f"Detected {len(change)} file changes in {blocks_path}..")
            if self.ws.active_connections_map:
                await self.ws.broadcast({"type": "manifest_update"})
