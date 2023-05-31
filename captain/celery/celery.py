from celery import Celery
from captain.utils.config import REDIS_HOST, REDIS_PORT

app = Celery('tasks', broker=f"redis://{REDIS_HOST}:{REDIS_PORT}")
