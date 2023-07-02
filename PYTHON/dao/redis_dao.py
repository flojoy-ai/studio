import json
from redis import Redis
import os
import numpy as np
import pandas as pd
from typing import Any, cast

MAX_LIST_SIZE = 1000
REDIS_HOST = os.environ.get("REDIS_HOST", "localhost")
REDIS_PORT = int(os.environ.get("REDIS_PORT", "6379"))


class RedisDao:
    _instance = None

    def __init__(self):
        self.r = Redis(host=REDIS_HOST, port=REDIS_PORT)

    @staticmethod
    def get_instance():
        if RedisDao._instance is None:
            RedisDao._instance = RedisDao()
        return RedisDao._instance

    def set_np_array(self, memo_key: str, value: Any):
        encoded = self.serialize_np(value)
        self.r.set(memo_key, encoded)

    def set_pandas_dataframe(self, key: str, dframe: pd.DataFrame):
        encode = dframe.to_json()
        self.r.set(key, encode)

    def set_str(self, key: str, value: str):
        self.r.set(key, value)

    def get_pd_dataframe(self, key: str):
        encoded = self.r.get(key)
        decode = encoded.decode("utf-8") if encoded is not None else ""
        read_json = pd.read_json(decode)
        return read_json.head()

    def get_np_array(self, memo_key: str, np_meta_data: dict[str, str]) -> list[Any]:
        encoded = self.r.get(memo_key)
        if encoded:
            return self.desirialize_np(encoded, np_meta_data)
        return []

    def get_str(self, key: str):
        encoded = self.r.get(key)
        return encoded.decode("utf-8") if encoded is not None else None

    def get_redis_obj(self, key: str) -> dict[str, Any]:
        r_obj = self.r.get(key)

        if r_obj:
            return cast(dict[str, Any], json.loads(r_obj))
        return {}

    def set_redis_obj(self, key: str, value: dict[str, Any]):
        dump = json.dumps(value)
        self.r.set(key, dump)

    def delete_redis_object(self, key: str):
        self.r.delete(key)

    def get_list(self, key: str):
        return self.r.lrange(key, 0, MAX_LIST_SIZE)

    def add_to_list(self, key: str, value: Any):
        self.r.lpush(key, value)

    def remove_item_from_list(self, key: str, item: Any):
        self.r.lrem(key, 1, item)

    def add_to_set(self, key: str, value: Any):
        self.r.sadd(key, value)

    def get_set_list(self, key: str):
        return self.r.smembers(key)

    def serialize_np(self, np_array: np.ndarray):
        return np_array.ravel().tostring()

    def desirialize_np(self, encoded: bytes, np_meta_data: dict[str, str]) -> list[Any]:
        d_type = np_meta_data.get("d_type", "")
        dimensions = np_meta_data.get("dimensions", [])
        shapes_in_int = [int(shape) for shape in dimensions]
        return np.fromstring(encoded, dtype=d_type).reshape(
            *shapes_in_int
        )  # type:ignore
