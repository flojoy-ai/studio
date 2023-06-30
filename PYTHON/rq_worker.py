from rq import Queue

try:
    from rq_win import WindowsWorker as Worker
except ImportError:
    from rq import Worker
import os
import sys
import debugpy
from dao.redis_dao import RedisDao

sys.path.append(os.path.abspath(os.getcwd()))

DEBUG_PORT_WORKER = 5678
DEBUG_PORT_WATCH = 5679


def debugger(port: int, worker_name: str):
    if os.environ.get("DEBUG", None) == "True":
        try:
            endpoint = debugpy.listen(port)
            print(f"Started debug server for rq:worker:{worker_name} on {endpoint}")
            is_wait = os.environ.get("DEBUG_WAIT", False) == "True"
            if is_wait:
                print(
                    f"Waiting on debugger for rq:worker:{worker_name} to attach on port: {port}"
                )
                debugpy.wait_for_client()
        except Exception:
            print(
                f"Failed to start debug server for rq:worker:{worker_name} or its already running"
            )
    else:
        print(f"Debugging for rq:worker:{worker_name} is disabled")


if __name__ == "__main__":
    worker_name = sys.argv[1]
    debugger(
        DEBUG_PORT_WORKER if worker_name == "flojoy" else DEBUG_PORT_WATCH, worker_name
    )
    queue = Queue(worker_name, connection=RedisDao().r)
    worker = Worker([queue], connection=RedisDao().r)
    worker.work()
