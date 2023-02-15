import json
from .flows import Flows
from .graph import Graph


def find_flows(graph: Graph, node_by_serial, cmds: list[str]):
    '''
    Given a list of commands it returns a dictionary with their flows
    '''
    flows = Flows()

    def dfs(source):
        childs = []
        cmd = node_by_serial[source]['cmd']
        node_id = node_by_serial[source]['id']

        # if node doesn't have any child, return itself as the only child in this branch
        if source not in graph.adj_list.keys():
            # ignoring as source does not have any child
            return [node_id]

        for value in graph.adj_list[source]:
            child_source = value['target_node']
            if cmd in cmds:
                child_node_ids = dfs(source=child_source)
                # childs = childs + child_node_ids

                # record the childs for the direction
                direction = value['handle'].lower()
                flows.extend_flow(node_id, direction, child_node_ids)

                print(
                    'source:', source,
                    'childs', child_node_ids,
                    'were added for direction:', direction,
                    '| all childs:', flows.get_flow(node_id, direction),
                    '| node_id:', node_id
                )
            else:
                # ignoring as its not a special command
                child_node_ids = dfs(source=child_source)
                childs = childs + child_node_ids
        return [node_id] + childs

    # finding the source of dfs tree which are nodes without any incoming edge
    dfs_sources = []
    for node in graph.DG.nodes:
        if len(list(graph.DG.predecessors(node))) == 0:
            dfs_sources.append(node)

    for source in dfs_sources:
        dfs(source=source)

    return flows


def apply_topology(flows: Flows, topology: list[int]):
    '''
    Fixes the ordering of nodes in the given flows according to the provided topology
    '''
    print('apply topology, for flows:', json.dumps(flows.all_node_data, indent=2), '\nbefore state:', topology)
    
    new_flows = Flows()
    for serial in topology:
        for node_id, node_data in flows.all_node_data.items():
            for direction, _ in node_data.items():
                if serial in flows.get_flow(node_id, direction):
                    new_flows.extend_flow(node_id, direction, [serial])
    flows.from_flows(new_flows)
    print('apply topology, after state:', topology)


def gather_all_flow_nodes(flows: Flows):
    node_serials = []
    for node_id, node_data in flows.all_node_data.items():
        for direction, child_ids in node_data.items():
            for child_id in child_ids:
                try:
                    node_serials += [child_id]
                except Exception:
                    pass
    return node_serials
