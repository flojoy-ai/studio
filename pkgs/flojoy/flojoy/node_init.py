from typing import Callable, Any

from flojoy.parameter_types import format_param_value
from .dao import Dao


class NoInitFunctionError(Exception):
    pass


# contains value returned by a node's init function
class NodeInitContainer:
    def __init__(self, value=None):
        self.value = value

    def set(self, value):
        self.value = value

    def get(self):
        return self.value


class NodeInit:
    def __init__(self, func):
        self.func = func

    def __call__(self, node_id: str, ctrls: dict[str, Any]):
        return self.run(node_id, ctrls)

    def run(self, node_id: str, ctrls: dict[str, Any]):
        daemon_container = NodeInitService().create_init_store(node_id)

        args = {
            name: format_param_value(ctrl["value"], ctrl["type"])
            for name, ctrl in ctrls.items()
        }
        res = self.func(**args)
        if res is not None:
            daemon_container.set(res)


# Wrapper for node_init functions, maps the node to the function that will initialize it.
def node_initialization(for_node):
    def decorator(func):
        func_init = NodeInit(func)
        NodeInitService().map_node_to_init_function(for_node, func_init)
        return func_init

    return decorator


class NodeInitService:
    """
    Class that handles different tasks related to node initialization
    """

    # this method will create the storage used for the node to hold whatever it initialized.
    def create_init_store(self, node_id):
        if self.has_init_store(node_id):
            raise ValueError(f"Storage for {node_id} init object already exists!")

        Dao.get_instance().set_init_container(node_id, NodeInitContainer())
        return self.get_init_store(node_id)

    # this method will get the storage used for the node to hold whatever it initialized.
    def get_init_store(self, node_id) -> NodeInitContainer:
        store = Dao.get_instance().get_init_container(node_id)
        if store is None:
            raise ValueError(
                f"Storage for {node_id} init object has not been initialized!"
            )
        return store

    # this method will check if a node has an init store already created.
    def has_init_store(self, node_id) -> bool:
        return Dao.get_instance().has_init_container(node_id)

    # this method will map a node to a function that will initialize it.
    def map_node_to_init_function(self, node_func, node_init_func):
        if NodeInitService().has_init_store(node_func.__name__):
            raise ValueError(f"Node {node_func.__name__} already has an init store!")
        Dao.get_instance().set_init_function(node_func, node_init_func)

    # this method will get the function that will initialize a node.
    def get_node_init_function(self, node_func) -> NodeInit:
        res = Dao.get_instance().get_init_function(node_func)
        if res is None:
            raise NoInitFunctionError(
                f"Node {node_func.__name__} does not have an init function!"
            )
        return res


def get_node_init_function(node_func: Callable) -> NodeInit:
    """
    Returns the function corresponding to the init function of the specified node.
    """
    return NodeInitService().get_node_init_function(node_func)
