import json


class Flows:
    '''
    Represents execution flows originating from multiple nodes.
    A node can have multiple flows.
    '''

    def __init__(self) -> None:
        self.all_node_data = {}  # {node_id -> {direction -> [child_node_id]} }

    def from_flows(self, flows):
        self.all_node_data = flows.all_node_data

    def get_node_data(self, node_id: str):
        if node_id not in self.all_node_data:
            self.all_node_data[node_id] = {}
        return self.all_node_data.get(node_id)

    def get_flow(self, node_id: str, direction: str) -> list[str]:
        node_data = self.get_node_data(node_id)
        if direction not in node_data:
            node_data[direction] = []
        return node_data[direction]

    def extend_flow(self, node_id: str, direction: str, direction_nodes: list[str]):
        current_direction_nodes = self.get_flow(node_id, direction)

        # remove duplicates
        for node_serial in current_direction_nodes:
            if node_serial in direction_nodes:
                direction_nodes.remove(node_serial)

        current_direction_nodes.extend(direction_nodes)

        # store the updated data
        node_data = self.get_node_data(node_id)
        node_data[direction] = current_direction_nodes

    def __str__(self):
        return json.dumps(self.all_node_data, indent=2)
