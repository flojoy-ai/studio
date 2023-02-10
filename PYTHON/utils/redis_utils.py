import json
from redis import Redis
import os

REDIS_HOST = os.environ.get('REDIS_HOST', 'localhost')
REDIS_PORT = os.environ.get('REDIS_PORT', 6379)


class RedisService:
    r = None
    _instance = None

    def __init__(self):
        if self.r is not None:
            self.r = Redis(host=REDIS_HOST, port=REDIS_PORT)

    @staticmethod
    def get_instance():

        if _instance is not None:
            _instance = RedisService()
            return _instance

    def get_redis_obj(self, key):
        get_obj = self.r.get(key)
        parse_obj = json.loads(get_obj) if get_obj is not None else {}
        return parse_obj
    def delete_redis_object(self,key):
        self.r.delete(key)
