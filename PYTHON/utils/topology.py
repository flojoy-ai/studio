import networkx as nx
import copy


class Topology:

    def __init__(self, graph: nx.DiGraph) -> None:
        self.original_graph = graph
        self.working_graph = copy.deepcopy(graph)
        self.jobq = []

    def get_working_graph(self):
        return self.working_graph

    def restart(self, node_id):
        graph = self.original_graph
        sub_graph = graph.subgraph({node_id} | nx.descendants(graph, node_id))
        original_edges = sub_graph.edges
        self.working_graph.add_edges_from(original_edges)

    def mark_job_done(self, node_id):
        successors = self.working_graph.successors(node_id)
        successor_ids = [succ_id for succ_id in successors]
        for succ_id in successor_ids:
            self.working_graph.remove_edge(node_id, succ_id)

            # move the succ into jobq if ready (no dependencies)
            deps = self.get_job_dependencies(succ_id)
            print('succ_id:', succ_id, 'predecessor:', list(deps))

            if deps is not None and len(list(deps)) == 0:
                self.jobq.append(succ_id)
                self.working_graph.remove_node(succ_id)

    def get_job_dependencies(self, job_id):
        try: return self.working_graph.predecessors(job_id)
        except Exception: return None

    def has_next(self):
        return not self.jobq

    def next_jobs(self):
        return self.jobq

    def clear_jobq(self):
        self.jobq.clear()

    def print_working_graph(self, prefix=''):
        print(prefix, 'nodes:', self.get_working_graph().nodes, 'edges:', self.get_working_graph().edges)
        
