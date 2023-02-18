import json
import networkx as nx
import copy


class Topology:

    def __init__(self, graph: nx.DiGraph) -> None:
        self.original_graph = graph
        self.working_graph = copy.deepcopy(graph)
        self.jobq = []

    def get_working_graph(self):
        return self.working_graph

    def collect_ready_jobs(self):
        print('collect ready jobs')
        for job_id in list(self.working_graph.nodes):
            self.add_to_jobq_if_ready(job_id)

    def restart(self, job_id):
        graph = self.original_graph
        sub_graph = graph.subgraph({job_id} | nx.descendants(graph, job_id))
        original_edges = sub_graph.edges
        self.working_graph.add_edges_from(original_edges)

    def mark_job_done(self, job_id, label='main'):
        print(F'job finished: {self.get_label(job_id)}, label:', label)
        self.remove_dependencies(job_id, label)
        self.working_graph.remove_node(job_id)

    def remove_dependencies(self, job_id, label='main'):
        edges = self.get_edges_by_label(job_id, label)
        for edge in edges:
            self.remove_dependency(edge[0], edge[1])

    def get_edges_by_label(self, job_id, label):
        edges = self.working_graph.edges(job_id)
        edges = [(s, t, self.working_graph.get_edge_data(s, t)) for (s, t) in edges]
        edges = [(s, t, data) for (s, t, data) in edges if data.get('label', '') == label]
        return edges

    def remove_dependency(self, job_id, succ_id):
        if self.working_graph.has_edge(job_id, succ_id):
            print(F' - remove dependency: {self.get_edge_label_string(job_id, succ_id)}')
            self.working_graph.remove_edge(job_id, succ_id)

    def add_to_jobq_if_ready(self, job_id):
        '''
        Checks if the provided job has any dependencies (no incoming edge). 
        If it doesn't, then it removes it from graph and moves it to jobq.
        '''
        deps = self.get_job_dependencies(job_id)
        deps_str = [self.get_label(dep) for dep in deps]
        print(' * check readiness for', self.get_label(
            job_id), '- remaining dependencies:', deps_str)

        if deps is not None and len(deps) <= 0:
            print(' + add', self.get_label(job_id), 'in jobq')
            if job_id not in self.jobq:
                self.jobq.append(job_id)

    def get_job_dependencies(self, job_id, original=False):
        graph = self.original_graph if original else self.working_graph
        try:
            return list(graph.predecessors(job_id))
        except Exception:
            return []

    def has_next(self):
        return self.get_working_graph().number_of_nodes() > 0

    def next_jobs(self):
        return self.jobq.copy()

    def clear_jobq(self):
        self.jobq.clear()

    def get_label(self, job_id):
        if self.working_graph.has_node(job_id):
            return self.working_graph.nodes[job_id].get('label', job_id)
        return ''

    def print_edges(self, edges, prefix=''):
        edges_str = [self.get_edge_label_string(s, t) for (s, t, _) in edges]
        print(prefix, edges_str)
        
    def get_edge_label_string(self, source_job_id, target_job_id, label=None):
        if label is None:
            label = self.working_graph.get_edge_data(source_job_id, target_job_id).get('label', '')
        s = self.get_label(source_job_id)
        t = self.get_label(target_job_id)
        return F"{s} -- {label} --> {t}"

    def print_working_graph(self, prefix='working graph:', verbose=False):
        graph = self.get_working_graph()
        nodes = [self.get_label(node_id) for node_id in list(graph.nodes)]
        edges = list(graph.edges.data())

        if not verbose:
            edges_str = [self.get_edge_label_string(s, t) for (s, t, _) in edges]

        print(
            prefix,
            '\nnodes:',
            json.dumps(nodes, indent=2),
            '\nedges:',
            json.dumps(edges_str, indent=2)
        )

    def print_jobq(self, prefix=''):
        jobq_str = [self.get_label(job_id) for job_id in self.jobq]
        print(F'\n{prefix}jobq:', jobq_str)
