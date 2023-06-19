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


DEFAULT_PORT = 5679


def debugger():
    print("Checking whether to run debugger for rq watch")
    if os.environ.get("DEBUG", None) == "True":
        port = int(os.environ.get("DEBUG_PORT", DEFAULT_PORT))
        try:
            endpoint = debugpy.listen(port)
            print(f"Started debugger for rq watch on {endpoint}")
            is_wait = os.environ.get("DEBUG_WAIT", False) == "True"
            if is_wait:
                print(f"Waiting for debugger for rq watch to attach on port: {port}")
                debugpy.wait_for_client()
        except Exception:
            print("Failed to start debugging for rq watch or its already running")
    else:
        print("Debugging for rq watch is off")


debugger()


if __name__ == "__main__":
    worker_name = sys.argv[1]
    queue = Queue(worker_name, connection=RedisDao().r)
    worker = Worker([queue], connection=RedisDao().r, name=worker_name)
    worker.work()