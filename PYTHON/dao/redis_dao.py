import json
from redis import Redis
import os

MAX_LIST_SIZE = 1000
REDIS_HOST = os.environ.get('REDIS_HOST', 'localhost')
REDIS_PORT = os.environ.get('REDIS_PORT', 6379)


class RedisDao:
    r = None
    _instance = None

    def __init__(self):
        if RedisDao.r is None:
            RedisDao.r = Redis(host=REDIS_HOST, port=REDIS_PORT)

    @staticmethod
    def get_instance():
        if RedisDao._instance is None:
            RedisDao._instance = RedisDao()
        return RedisDao._instance

    def get_redis_obj(self, key:str):
        get_obj = self.r.get(key)
        parse_obj = json.loads(get_obj) if get_obj is not None else {}
        return parse_obj

    def set_redis_obj(self, key: str, value: dict):
        dump = json.dumps(value)
        self.r.set(key, dump)

    def delete_redis_object(self, key):
        self.r.delete(key)

    def get_list(self, key):
        return self.r.lrange(key, 0, MAX_LIST_SIZE)

    def add_to_list(self, key, value):
        self.r.lpush(key, value)

    def remove_item_from_list(self, key, item):
        self.r.lrem(key, 1, item)
