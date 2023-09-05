from flojoy import flojoy, node_initialization, NodeInitContainer, OrderedPair, Array
import numpy as np


@flojoy(node_type="TEST_TYPE")
def NODE_INIT(init_container: NodeInitContainer, a: int = 0) -> OrderedPair:
    return OrderedPair(x=np.array([]), y=np.array([]))


@node_initialization(for_node=NODE_INIT)
def init(foo: str, bar: int, baz: float, quux: bool, asdf: Array, s: str = "hello"):
    return "test"
