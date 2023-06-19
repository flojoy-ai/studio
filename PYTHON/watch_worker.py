from rq import Queue, Worker
import os

import debugpy

from dao.redis_dao import RedisDao

DEFAULT_PORT = 5679


def debugger():
    print("Checking whether to run debugger for rq watch")
    if os.environ.get("DEBUG", None) == "True":
        port = os.environ.get("DEBUG_PORT", DEFAULT_PORT)
        try:
            endpoint = debugpy.listen(port)
            print(f"Started debugger for rq watch on {endpoint}")
            is_wait = os.environ.get("DEBUG_WAIT", False) == "True"
            if is_wait:
                print(f"Waiting for debugger for rq watch to attach on port: {port}")
                debugpy.wait_for_client()
        except:
            print(f"Failed to start debugging for rq watch or its already running")
    else:
        print(f"Debugging for rq watch is off")


debugger()

queue = Queue("flojoy-watch", connection=RedisDao().r)

worker = Worker([queue], connection=RedisDao().r, name="flojoy-watch")
worker.work()
