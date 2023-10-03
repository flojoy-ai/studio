from numpy import ndarray
from pandas import DataFrame as PandasDataFrame
from typing import Any, Callable
from threading import Lock
from .data_container import DCNpArrayType

MAX_LIST_SIZE = 1000

_dict_sm_lock = Lock()  # dict small memory lock
_dict_job_lock = Lock()  # dict job lock
_dict_node_init_container_lock = Lock()
_dict_node_init_func_lock = Lock()
_init_lock = Lock()

"""
Used by clients to create a new instance of the datastorage
"""


def create_storage():
    return Dao.get_instance()


"""
This class is a Singleton that acts as a in-memory datastorage

IMPORTANT: The commented code should not be removed, as it acts as a reference for the future
in case we need to implement a Redis based datastorage
"""


class Dao:
    _instance = None

    @classmethod
    def get_instance(cls):
        with _init_lock:
            if Dao._instance is None:
                Dao._instance = Dao()
            return Dao._instance

    def __init__(self):
        self.storage = {}  # small memory
        self.job_results = {}
        self.node_init_container = {}
        self.node_init_func = {}

    """
    METHODS FOR JOB RESULTS
    """

    def get_job_result(self, job_id: str) -> Any | None:
        with _dict_job_lock:
            res = self.job_results.get(job_id, None)
        if res is None:
            raise ValueError(f"Job result with id {job_id} does not exist")
        return res

    def post_job_result(self, job_id: str, result: Any):
        with _dict_job_lock:
            self.job_results[job_id] = result

    def clear_job_results(self):
        with _dict_job_lock:
            self.job_results.clear()

    def job_exists(self, job_id: str) -> bool:
        with _dict_job_lock:
            return job_id in self.job_results.keys()

    def delete_job(self, job_id: str):
        with _dict_job_lock:
            self.job_results.pop(job_id, None)

    """
    METHODS FOR SMALL MEMORY
    """

    def clear_small_memory(self):
        with _dict_sm_lock:
            self.storage.clear()

    def check_if_valid(self, result: Any | None, expected_type: Any):
        with _dict_sm_lock:
            if result is not None and not isinstance(result, expected_type):
                raise ValueError(
                    f"Expected {expected_type} type, but got {type(result)} instead!"
                )

    def set_np_array(self, memo_key: str, value: DCNpArrayType):
        with _dict_sm_lock:
            self.storage[memo_key] = value

    def set_pandas_dataframe(self, key: str, dframe: PandasDataFrame):
        with _dict_sm_lock:
            self.storage[key] = dframe

    def set_str(self, key: str, value: str):
        with _dict_sm_lock:
            self.storage[key] = value

    def get_pd_dataframe(self, key: str) -> PandasDataFrame | None:
        with _dict_sm_lock:
            encoded = self.storage.get(key, None)
        self.check_if_valid(encoded, PandasDataFrame)
        return encoded

    def get_np_array(self, memo_key: str) -> DCNpArrayType | None:
        with _dict_sm_lock:
            encoded = self.storage.get(memo_key, None)
        self.check_if_valid(encoded, ndarray)
        return encoded

    def get_str(self, key: str) -> str | None:
        with _dict_sm_lock:
            encoded = self.storage.get(key, None)
        return encoded

    def get_obj(self, key: str) -> dict[str, Any] | None:
        with _dict_sm_lock:
            r_obj = self.storage.get(key, None)
        self.check_if_valid(r_obj, dict)
        return r_obj

    def set_obj(self, key: str, value: dict[str, Any]):
        with _dict_sm_lock:
            self.storage[key] = value

    def delete_object(self, key: str):
        with _dict_sm_lock:
            self.storage.pop(key)

    def remove_item_from_set(self, key: str, item: Any):
        with _dict_sm_lock:
            res = self.storage.get(key, None)
        self.check_if_valid(res, set)
        if not res:
            return
        with _dict_sm_lock:
            res.remove(item)

    def add_to_set(self, key: str, value: Any):
        with _dict_sm_lock:
            res: set[Any] | None = self.storage.get(key, None)
        if res is None:
            res = set()
            res.add(value)
            self.storage[key] = res
            return
        self.check_if_valid(res, set)
        with _dict_sm_lock:
            res.add(value)

    def get_set_list(self, key: str) -> list[Any] | None:
        with _dict_sm_lock:
            res = self.storage.get(key, None)
        if res is None:
            return None
        self.check_if_valid(res, set)
        return list(res)

    """
    METHODS FOR NODE INIT
    """

    # -- for node container --
    def clear_node_init_containers(self):
        with _dict_node_init_container_lock:
            self.node_init_container.clear()

    def set_init_container(self, node_id: str, value):
        with _dict_node_init_container_lock:
            self.node_init_container[node_id] = value

    def get_init_container(self, node_id: str):
        with _dict_node_init_container_lock:
            res = self.node_init_container.get(node_id, None)
        from .node_init import NodeInitContainer  # avoid circular import

        self.check_if_valid(res, NodeInitContainer)
        return res

    def has_init_container(self, node_id: str) -> bool:
        with _dict_node_init_container_lock:
            return node_id in self.node_init_container.keys()

    # ------------------------

    # -- for node init function --
    def set_init_function(self, node_func, node_init_func):
        with _dict_node_init_func_lock:
            self.node_init_func[node_func] = node_init_func

    def get_init_function(self, node_func: Callable):
        with _dict_node_init_func_lock:
            res = self.node_init_func.get(node_func, None)
        from .node_init import NodeInit  # avoid circular import

        self.check_if_valid(res, NodeInit)
        return res

    def has_init_function(self, node_func) -> bool:
        with _dict_node_init_func_lock:
            return node_func in self.node_init_func.keys()

    # ----------------------------
