import os
from rq import Worker, Queue
from dao.redis_dao import RedisDao
import sys

queue = Queue("flojoy", connection=RedisDao().r)

class MyWorker(Worker):
    def work(self, *args, **kwargs):
        sys.path.append(os.path.dirname(sys.path[0]))
        import PYTHON.nodes 
        super().work(*args, **kwargs)


queue = Queue("flojoy", connection=RedisDao().r)
worker = MyWorker(queues=[queue], connection=RedisDao().r, name=sys.argv[1])
worker.work()
