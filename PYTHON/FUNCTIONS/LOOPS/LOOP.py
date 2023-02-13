from flojoy import flojoy, JobResultBuilder


from flojoy import flojoy
from flojoy import JobResultBuilder
from node_sdk.small_memory import SmallMemory


memory_key = 'loop-info'


class LoopData:
    def __init__(self, job_id, num_loops=-1, current_iteration=0, is_finished=False) -> None:
        self.job_id = job_id
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
            'job_id': self.job_id,
            'num_loops': self.num_loops,
            'current_iteration': self.current_iteration,
            'is_finished': self.is_finished
        }

    @staticmethod
    def from_data(job_id, data):
        loop_data = LoopData(
            job_id,
            num_loops=data.get('num_loops', -1),
            current_iteration=data.get('current_iteration', 0),
            is_finished=data.get('is_finished', False)
        )
        return loop_data

    def print(self):
        print(self.get_data())


@flojoy
def LOOP(v, params):
    num_loops = params.get('num_loops', 0)
    job_id = params.get('job_id', 0)

    # infinite loop
    if num_loops == -1:
        return build_result(inputs=v, is_loop_finished=False)

    loop_data: LoopData = load_loop_data(job_id, num_loops)
    loop_data.print()

    # loop was previously finished, but now re-executing, so restart
    if loop_data.is_finished:
        loop_data.restart()
    else:
        loop_data.step()

    store_loop_data(job_id, loop_data)

    return build_result(v, loop_data.is_finished)


def load_loop_data(job_id, default_num_loops) -> LoopData:
    data = SmallMemory().read_object(job_id, memory_key)
    loop_data = LoopData.from_data(
        job_id=job_id,
        data={'num_loops': default_num_loops, **data}
    )
    return loop_data


def store_loop_data(job_id, loop_data: LoopData):
    SmallMemory().write_object(job_id, memory_key, loop_data.get_data())


def build_result(inputs, is_loop_finished):
    return JobResultBuilder() \
        .from_inputs(inputs) \
        .flow_by_flag(
            flag=is_loop_finished,
            directionsWhenFalse=['body'],
            directionsWhenTrue=['end']) \
        .build()
