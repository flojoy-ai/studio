import json

from node_sdk.small_memory import SmallMemory

from flojoy import JobResultBuilder, flojoy

memory_key = 'loop-info'


class LoopData:
    def __init__(self, node_id, num_loops=-1, current_iteration=0, is_finished=False) -> None:
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
            'node_id': self.node_id,
            'num_loops': self.num_loops,
            'current_iteration': self.current_iteration,
            'is_finished': self.is_finished
        }

    @staticmethod
    def from_data(node_id, data):
        loop_data = LoopData(
            node_id,
            num_loops=data.get('num_loops', -1),
            current_iteration=data.get('current_iteration', 0),
            is_finished=data.get('is_finished', False)
        )
        return loop_data

    def print(self, prefix=''):
        print(F'{prefix}loop Data:', json.dumps(self.get_data(), indent=2))


@flojoy
def LOOP(v, params):
    num_loops = params.get('num_loops', 0)
    node_id = params.get('node_id', 0)
    
    print('\n\nstart loop:', node_id)


    # infinite loop
    if num_loops == -1:
        print('infinite loop')
        return build_result(inputs=v, is_loop_finished=False)

    loop_data: LoopData = load_loop_data(node_id, num_loops)
    loop_data.print('at start ')

    # loop was previously finished, but now re-executing, so restart
    if loop_data.is_finished:
        loop_data.restart()
    else:
        loop_data.step()

    if not loop_data.is_finished:
        store_loop_data(node_id, loop_data)
    else:
        print('finished loop')
        delete_loop_data(node_id)

    print('end loop\n\n')

    return build_result(v, loop_data.is_finished)
    


def load_loop_data(node_id, default_num_loops) -> LoopData:
    data = SmallMemory().read_object(node_id, memory_key)
    loop_data = LoopData.from_data(
        node_id=node_id,
        data={'num_loops': default_num_loops, **data}
    )
    return loop_data


def store_loop_data(node_id, loop_data: LoopData):
    SmallMemory().write_object(node_id, memory_key, loop_data.get_data())
    loop_data.print('store ')

def delete_loop_data(node_id):
    SmallMemory().delete_object(node_id, memory_key)
    print('delete loop data')


def build_result(inputs, is_loop_finished):
    return JobResultBuilder() \
        .from_inputs(inputs) \
        .flow_by_flag(
            flag=is_loop_finished,
            directionsWhenFalse=['body'],
            directionsWhenTrue=['end']) \
        .build()
