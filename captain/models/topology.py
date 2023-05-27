from copy import deepcopy

class Topology:
    def __init__(self, graph, redis_client, jobset_id, extra_params: dict):
        self.working_graph = deepcopy(graph)
        self.original_graph = deepcopy(graph)
        self.redis_client = redis_client
        self.jobset_id = jobset_id
        self.node_delay = extra_params.get("nodeDelay", 0)
        self.max_runtime = extra_params.get("maxRuntime", 0)

    # initial logic of topology
    def run(self):
        raise NotImplementedError("Function not implemented.")
