from captain.internal.wsmanager import ConnectionManager

from captain.types.worker import WorkerJobResponse


class LogConsumer:
    def __init__(self) -> None:
        self.ws = ConnectionManager.get_instance()

    async def run(self):
        while True:
            log_entry = self.ws.log_queue.get()
            active_conns = list(self.ws.active_connections_map.keys())
            if active_conns:
                socket_msg = WorkerJobResponse(
                    jobset_id=active_conns[-1], dict_item={"BACKEND_LOG": log_entry}
                )
                await self.ws.broadcast(socket_msg)

            self.ws.log_queue.task_done()
