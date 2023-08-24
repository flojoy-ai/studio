try:
    import ujson # micropython json equivalent
except ImportError:
    import json as ujson

# TODO switch to multigraph
class DiGraph:
    """
    This is a class that represents a directed graph.
    Behaves similar to a networkx.DiGraph, but is more lightweight.
    """
    def __init__(self):
        self.nodes = dict()
        self.edges = dict()
        self.edges_reverse = dict()

    def copy(self):
        copy = DiGraph() # type: ignore
        copy.nodes = ujson.loads(ujson.dumps(self.nodes))
        copy.edges = ujson.loads(ujson.dumps(self.edges))
        copy.edges_reverse = ujson.loads(ujson.dumps(self.edges_reverse))
        return copy

    def add_node(self, node_id: str, **kwargs):
        self.nodes[node_id] = kwargs
    
    def add_edge(self, source: str, target: str, **kwargs):
        if source not in self.edges:
            self.edges[source] = dict()
        self.edges[source][target] = kwargs

        if target not in self.edges_reverse:
            self.edges_reverse[target] = dict()
        self.edges_reverse[target][source] = kwargs
    
    def in_degree(self, node_id: str) -> int:
        return len(self.edges_reverse.get(node_id, dict()))

    def out_edges(self, node_id: str) -> list:
        return [(node_id, target) for target in self.edges.get(node_id, dict()).keys()]
    
    def get_edge_data(self, source: str, target: str) -> dict:
        return self.edges.get(source, dict()).get(target, dict())
    
    def get_edges(self, source: str) -> list:
        return [(source, destination) for destination in self.edges.get(source, dict()).keys()]
    
    def get_all_edges(self) -> list:
        return [(source, destination) for source in self.edges.keys() for destination in self.edges[source].keys()]
    
    def get_nodes(self) -> dict:
        return self.nodes

    def has_edge(self, source: str, target: str) -> bool:
        return target in self.edges.get(source, dict())
    
    def remove_edge(self, source: str, target: str):
        if source in self.edges and target in self.edges[source]:
            del self.edges[source][target]
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
        subgraph = DiGraph()
        for node in nodes:
            subgraph.add_node(node, **self.nodes[node])
            for source, target in self.get_edges(node):
                subgraph.add_edge(source, target, **self.get_edge_data(source, target))
        return subgraph
    
    def add_edges_from(self, other):
        for source, target, data in other:
            self.add_edge(source, target, **data)