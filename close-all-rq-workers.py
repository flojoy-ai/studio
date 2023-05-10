import signal
import redis
import os
from rq import Queue, Worker

REDIS_HOST = os.environ.get("REDIS_HOST", "localhost")
REDIS_PORT = os.environ.get("REDIS_PORT", 6379)
r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT)

q1 = Queue("flojoy-watch", connection=r)
flojoy_watch_queue_is_empty = q1.is_empty()
if flojoy_watch_queue_is_empty == False:
    q1.empty()

q2 = Queue("flojoy", connection=r)
flojoy_queue_is_empty = q2.is_empty()
if flojoy_queue_is_empty == False:
    q2.empty()

for w in Worker.all(connection=r):
    if w.pid is not None:
        try:
            os.kill(w.pid, signal.SIGTERM)
        except OSError:
            print("No rq workers running")
            pass
