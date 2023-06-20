from redis import Redis
from rq import Queue, Worker
import os, sys
import debugpy

sys.path.append(os.path.dirname(sys.path[0]))
print(os.path.dirname(sys.path[0]))
from PYTHON.dao.redis_dao import RedisDao

DEFAULT_PORT = 5678


def debugger():
    print("Checking whether to run debugger")
    if os.environ.get("DEBUG", None) == "True":
        port = os.environ.get("DEBUG_PORT", DEFAULT_PORT)
        try:
            endpoint = debugpy.listen(port)
            print(f"Started debugger on {endpoint}")
            is_wait = os.environ.get("DEBUG_WAIT", False) == "True"
            if is_wait:
                print(f"Waiting for debugger to attach on port: {port}")
                debugpy.wait_for_client()
        except:
            print(f"Failed to start debugging or its already running")
    else:
        print(f"Debugging is off")


debugger()

queue = Queue("flojoy", connection=RedisDao().r)

worker = Worker([queue], connection=RedisDao().r, name="flojoy")
worker.work()
