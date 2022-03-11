import json
import networkx as nx
import numpy as np
from plotly import plot
from redis import Redis
from rq import Queue

queue = Queue(connection=Redis())

import sys
sys.path.append('../FUNCTIONS/')
from generators import *

# Load React flow chart object from JSON file

f = open('../WATCH/fc.json')
fc = json.loads(f.read())
elems = fc['elements']

# Now, we replicate the React Flow chart in Python's networkx

DG = nx.DiGraph()

# Add nodes to networkx directed graph

for i in range(len(elems)):
    el = elems[i]
    if 'source' not in el:
        DG.add_node(i+1, pos=(el['position']['x'], el['position']['y']))
        elems[i]['index'] = i+1
        elems[i]['label'] = el['id'].split('-')[0]

# Add edges to networkx directed graph

def get_tuple(edge):
    e = [-1, -1]
    src_id = edge['source']
    tgt_id = edge['target']
    # iterate through all nodes looking for matching edge
    for el in elems:
        if 'id' in el:
            if el['id'] == src_id:
                e[0] = el['index']
            elif el['id'] == tgt_id:
                e[1] = el['index']
    return tuple(e)

for i in range(len(elems)):
    el = elems[i]
    if 'source' in el:
        # element is an edge
        e = get_tuple(el)
        DG.add_edge(*e)

# Add labls and data to each node object

def get_node_data_by_id():
    nodes_by_id = dict()
    for n, nd in DG.nodes().items():
        if n is not None:
            nodes_by_id[n] = nd
    return nodes_by_id

nodes_by_id = get_node_data_by_id()

# Traverse tree in reverse topological sort 
# and add jobs to Redis queue

for n in nx.topological_sort(DG):
    print('Adding to queue:', nodes_by_id[n])
    for p in DG.predecessors(n):
        print(DG.nodes[p]['cmd'], 'is a predecessor to', DG.nodes[n]['cmd'])