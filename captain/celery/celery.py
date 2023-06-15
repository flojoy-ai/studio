from celery import Celery
from captain.utils.config import REDIS_HOST, REDIS_PORT

app = Celery('tasks', backend=f"redis://{REDIS_HOST}:{REDIS_PORT}", broker=f"redis://{REDIS_HOST}:{REDIS_PORT}")

app.conf.update(
    task_serializer='pickle'
)
