
from collections import defaultdict


class Graph:
    '''
    Flojoy's internal representation of a flow chart
    (That's how we intend/can to use it - @dev.nested)
    '''

    def __init__(self, DG, edge_label_dict):
        self.DG = DG
        self.edges = DG.edges
        self.nodes = DG.nodes
        self.edge_label_dict = edge_label_dict

        self.nodes_by_id = dict()
        for n, nd in self.DG.nodes().items():
            self.nodes_by_id[n] = nd

        self.adj_list = defaultdict(list)
        self.make_adjancency_list()

    def make_adjancency_list(self):
        for (src, dest) in self.edges:
            for value in self.edge_label_dict[self.nodes_by_id[dest]['id']]:
                if value['source'] == self.nodes_by_id[src]['id']:
                    source_handle = value['sourceHandle']
            self.adj_list[src].append({
                'target_node_id': self.nodes_by_id[dest]['id'],
                'src_node_id': self.nodes_by_id[src]['id'],
                'target_node': dest,
                'handle': source_handle
            })

    # TODO prev job ids can be precalculated
    def get_previous_job_ids(self, node_serial):
        previous_job_ids = []
        for p in self.DG.predecessors(node_serial):
            job_id = self.DG.nodes[p]['id']
            previous_job_ids.append(job_id)
        return previous_job_ids
        