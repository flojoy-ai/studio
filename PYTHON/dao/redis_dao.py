import json
from redis import Redis
import os
import numpy as np
import pandas as pd

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

    def set_np_array(self, memo_key: str, value: np.ndarray):
        encoded = self.serialize_np(value)
        return self.r.set(memo_key, encoded)

    def set_pandas_dataframe(self, key: str, dframe: pd.DataFrame):
        encode = dframe.to_json()
        self.r.set(key, encode)
        return

    def set_str(self, key: str, value: str):
        self.r.set(key, value)
        return

    def get_pd_dataframe(self, key: str):
        encoded = self.r.get(key)
        decode = encoded.decode("utf-8") if encoded is not None else ''
        read_json = pd.read_json(decode)
        return read_json.head()

    def get_np_array(self, memo_key: str):
        encoded = self.r.get(memo_key)
        decode = self.desirialize_np(encoded, memo_key)
        return decode

    def get_str(self, key: str):
        encoded = self.r.get(key)
        return encoded.decode("utf-8") if encoded is not None else None

    def get_redis_obj(self, key: str):
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

    def add_to_set(self, key, value):
        self.r.sadd(key, value)

    def get_set_list(self, key):
        return self.r.smembers(key)

    def serialize_np(self, np_array: np.ndarray):
        return np_array.ravel().tostring()

    def desirialize_np(self, encoded: str, memo_key: str):
        if encoded is None:
            return []
        split_key = memo_key.split('|')[1].split('#')
        d_len = len(split_key)
        if d_len == 0:
            return []
        d_type = split_key[0]
        nd_array = np.fromstring(encoded, dtype=d_type)
        if d_len == 6:
            return nd_array.reshape(int(split_key[1]), int(split_key[2]), int(split_key[3]), int(split_key[4]), int(split_key[5]))
        if d_len == 5:
            return nd_array.reshape(int(split_key[1]), int(split_key[2]), int(split_key[3]), int(split_key[4]))
        if d_len == 4:
            return nd_array.reshape(int(split_key[1]), int(split_key[2]), int(split_key[3]))
        if d_len == 3:
            return nd_array.reshape(int(split_key[1]), int(split_key[2]))
        if d_len == 2:
            return nd_array.reshape(int(split_key[1]))
        raise ValueError(
            "Currently RedisDao only supports up to 5d numpy arrays!")
