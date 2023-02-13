class Flows:
    '''
    Represents execution flows originating from a node. 
    A node can have multiple flows.
    '''

    def __init__(self) -> None:
        self.all_node_data = {} # {node_id -> {direction -> [node_id]} }

    def from_flows(self, flows):
        self.all_node_data = flows.all_node_data
    
    def get_node_data(self, node_id: str):
        if node_id not in self.all_node_data:
            self.all_node_data[node_id] = {}
        return self.all_node_data.get(node_id)

    def set_node_data(self, node_id: str, node_flows):
        self.all_node_data[node_id] = node_flows

    def get_flow(self, node_id: str, direction: str):
        node_data = self.get_node_data(node_id)
        if direction not in node_data:
            node_data[direction] = []
        return node_data[direction]

    def set_flow(self, node_id: str, direction: str, direction_nodes):
        new_direction_nodes = list(set(direction_nodes)) # remove duplicates
        node_data = self.get_node_data(node_id)
        node_data[direction] = new_direction_nodes

    def extend_flow(self, node_id: str, direction: str, direction_nodes):
        current_direction_nodes = self.get_flow(node_id, direction)
        current_direction_nodes.extend(direction_nodes)
        new_direction_nodes = list(set(current_direction_nodes)) # remove duplicates
        node_data = self.get_node_data(node_id)
        node_data[direction] = new_direction_nodes

    