try:
    import ujson  # micropython json equivalent
except ImportError:
    import json as ujson


class MultiDiGraph:
    """
    This is a class that represents a multi directed graph.
    Behaves similar to a networkx.MultiDiGraph, but is more lightweight.
    """

    def __init__(self):
        self.nodes = dict()
        self.edges = dict()
        self.edges_reverse = dict()

    def copy(self):
        copy = MultiDiGraph()
        copy.nodes = ujson.loads(ujson.dumps(self.nodes))
        copy.edges = ujson.loads(ujson.dumps(self.edges))
        copy.edges_reverse = ujson.loads(ujson.dumps(self.edges_reverse))
        return copy

    def add_node(self, node_id: str, **kwargs):
        self.nodes[node_id] = kwargs

    def add_edge(self, source: str, target: str, **kwargs):
        if source not in self.edges:
            self.edges[source] = dict()
        if target not in self.edges[source]:
            self.edges[source][target] = []
        self.edges[source][target].append(kwargs)

        if target not in self.edges_reverse:
            self.edges_reverse[target] = dict()
        if source not in self.edges_reverse[target]:
            self.edges_reverse[target][source] = []
        self.edges_reverse[target][source].append(kwargs)

    def in_degree(self, node_id: str) -> int:
        return sum(map(len, self.edges_reverse.get(node_id, dict()).values()))

    def in_edges(self, node_id: str) -> list:
        return [
            (source, node_id, data)
            for source, data_list in self.edges_reverse.get(node_id, dict()).items()
            for data in data_list
        ]

    def out_edges(self, node_id: str) -> list:
        return [
            (node_id, target, data)
            for target, data_list in self.edges.get(node_id, dict()).items()
            for data in data_list
        ]

    def get_edge_data(self, source: str, target: str) -> list:
        return self.edges.get(source, dict()).get(target, [])

    def get_edges(self, source: str) -> list:
        return [
            (source, destination, data)
            for destination, data_list in self.edges.get(source, dict()).items()
            for data in data_list
        ]

    def get_all_edges(self) -> list:
        return [
            (source, destination, data)
            for source in self.edges.keys()
            for destination, data_list in self.edges[source].items()
            for data in data_list
        ]

    def get_nodes(self) -> dict:
        return self.nodes

    def has_edge(self, source: str, target: str) -> bool:
        return target in self.edges.get(source, dict())

    def remove_edge(self, source: str, target: str, index: int = -1):
        if index == -1:  # Remove all edges between source and target
            if source in self.edges and target in self.edges[source]:
                del self.edges[source][target]
                del self.edges_reverse[target][source]
        else:  # Remove the specific edge using the provided index
            if source in self.edges and target in self.edges[source]:
                del self.edges[source][target][index]
                del self.edges_reverse[target][source][index]
                if not self.edges[source][target]:
                    del self.edges[source][target]
                if not self.edges_reverse[target][source]:
                    del self.edges_reverse[target][source]

    def successors(self, node_id: str) -> list:
        return list(self.edges.get(node_id, dict()).keys())

    def predecessors(self, node_id: str) -> list:
        return list(self.edges_reverse.get(node_id, dict()).keys())

    def descendants(self, node_id: str) -> list:
        descendants = []
        for child in self.successors(node_id):
            descendants.append(child)
            descendants.extend(self.descendants(child))
        return descendants

    def subgraph(self, nodes: list):
        subgraph = MultiDiGraph()
        for node in nodes:
            subgraph.add_node(node, **self.nodes[node])
            for source, target, data in self.get_edges(node):
                subgraph.add_edge(source, target, **data)
        return subgraph

    def add_edges_from(self, other):
        for source, target, data in other:
            self.add_edge(source, target, **data)
