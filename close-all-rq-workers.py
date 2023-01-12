import signal
import redis
import os
from rq import Queue, Worker

REDIS_HOST = os.environ.get('REDIS_HOST', 'localhost')
REDIS_PORT = os.environ.get('REDIS_PORT', 6379)
r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT)

q = Queue('flojoy-watch', connection=r)
print('queue flojoy-watch isEmpty? ', q.is_empty())
q.empty();

q = Queue('flojoy', connection=r)
print('queue flojoy isEmpty? ', q.is_empty())
q.empty();

for w in Worker.all(connection=r):
    os.kill(w.pid, signal.SIGINT)