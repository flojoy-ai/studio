from copy import deepcopy


class Topology:
    # TODO: Properly type all the variables and maybe get rid of deepcopy?
    def __init__(
        self, graph, redis_client, jobset_id, node_delay: int = 0, max_runtime: int = 0
    ):
        self.working_graph = deepcopy(graph)
        self.original_graph = deepcopy(graph)
        self.redis_client = redis_client
        self.jobset_id = jobset_id
        self.node_delay = node_delay
        self.max_runtime = max_runtime

    # initial logic of topology
    def run(self):
        raise NotImplementedError("Function not implemented.")
