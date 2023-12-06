import json
from typing import TypedDict, Any, Optional
from flojoy import JobResultBuilder, DataContainer, flojoy, DefaultParams, SmallMemory

memory_key = "loop-info"


class LoopOutput(TypedDict):
    body: Any
    end: Any


class LoopData:
    def __init__(
        self,
        node_id: str,
        num_loops: int = -1,
        current_iteration: int = 0,
        is_finished: bool = False,
    ) -> None:
        self.node_id = node_id
        self.num_loops = int(num_loops)
        self.current_iteration = int(current_iteration)
        self.is_finished = bool(is_finished)

    def restart(self):
        self.current_iteration = 0
        self.is_finished = False

    def step(self):
        self.current_iteration += 1
        if self.current_iteration > self.num_loops:
            self.is_finished = True

    def get_data(self):
        return {
            "node_id": self.node_id,
            "num_loops": self.num_loops,
            "current_iteration": self.current_iteration,
            "is_finished": self.is_finished,
        }

    @staticmethod
    def from_data(node_id: str, data: dict[str, Any]):
        loop_data = LoopData(
            node_id,
            num_loops=data.get("num_loops", -1),
            current_iteration=data.get("current_iteration", 0),
            is_finished=data.get("is_finished", False),
        )
        return loop_data

    def print(self, prefix: str = ""):
        print(f"{prefix}loop Data:", json.dumps(self.get_data(), indent=2))


@flojoy(inject_node_metadata=True)
def LOOP(
    default_params: DefaultParams,
    default: Optional[DataContainer] = None,
    num_loops: int = -1,
) -> LoopOutput:
    """Iterate through the LOOP body blocks a given number of times (or -1 times for infinite looping).

    Parameters
    ----------
    num_loops : int
        number of times to iterate through body nodes, default is "-1" meaning infinity.

    Returns
    -------
    body : DataContainer
        Forwards the input DataContainer to the body.
    end : DataContainer
        Forwards the input DataContainer to the end.
    """

    node_id = default_params.node_id

    loop_data: LoopData = load_loop_data(node_id, num_loops)

    # given the addition of the break node, it is possible that
    # another node can write to the data of this loop. we have to
    # now check if that's the case, and if so, return
    if loop_data.get_data().get("is_finished"):
        # ensure that the node can be restarted after
        # breaking, like in a nested loop
        loop_data.is_finished = False
        store_loop_data(node_id, loop_data)
        return build_result([default] if default else [], True)

    # again owing to the addition of the break node, we
    # need to write the data to memory first before
    # processing logic so other nodes can always see the data
    store_loop_data(node_id, loop_data)

    # infinite loop
    if num_loops == -1:
        return build_result(inputs=[default] if default else [], is_loop_finished=False)

    # loop was previously finished, but now re-executing, so restart
    if loop_data.is_finished:
        loop_data.restart()
    else:
        loop_data.step()

    if not loop_data.is_finished:
        store_loop_data(node_id, loop_data)
    else:
        delete_loop_data(node_id)

    return build_result([default] if default else [], loop_data.is_finished)


def load_loop_data(node_id: str, default_num_loops: int) -> LoopData:
    data: dict[str, Any] = SmallMemory().read_memory(node_id, memory_key) or {}
    loop_data = LoopData.from_data(
        node_id=node_id, data={"num_loops": default_num_loops, **data}
    )
    return loop_data


def store_loop_data(node_id: str, loop_data: LoopData):
    SmallMemory().write_to_memory(node_id, memory_key, loop_data.get_data())


def delete_loop_data(node_id: str):
    SmallMemory().delete_object(node_id, memory_key)


def build_result(inputs: list[DataContainer], is_loop_finished: bool):
    return LoopOutput(
        body=JobResultBuilder()
        .from_inputs(inputs)
        .flow_by_flag(
            flag=is_loop_finished, false_direction=["body"], true_direction=["end"]
        )
        .build(),
        end=JobResultBuilder()
        .from_inputs(inputs)
        .flow_by_flag(
            flag=is_loop_finished, false_direction=["body"], true_direction=["end"]
        )
        .build(),
    )
