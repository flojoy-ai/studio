import os
import json
import yaml
import time
import networkx as nx
import numpy as np
from plotly import plot
from redis import Redis
from rq import Queue
from rq.job import Job

import warnings
import matplotlib.cbook
warnings.filterwarnings("ignore",category=matplotlib.cbook.mplDeprecation)

from GENERATORS import *
from TRANSFORMERS import *
from VISORS import *

stream = open('STATUS_CODES.yml', 'r')
stream = open('STATUS_CODES.yml', 'r') 
STATUS_CODES = yaml.safe_load(stream)

from utils import PlotlyJSONEncoder

r = Redis()
q = Queue(connection=r)

# import sys
# sys.path.append('../FUNCTIONS/')

# Load React flow chart object from JSON file

print(os.getcwd())

f = open('PYTHON/WATCH/fc.json')
fc = json.loads(f.read())
elems = fc['elements']

# Replicate the React Flow chart in Python's networkx

DG = nx.DiGraph()

# Add nodes to networkx directed graph

for i in range(len(elems)):
    el = elems[i]
    if 'source' not in el:
        DG.add_node(i+1, pos=(el['position']['x'], el['position']['y']))
        elems[i]['index'] = i+1
        elems[i]['label'] = el['id'].split('-')[0]

pos = nx.get_node_attributes(DG,'pos')

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

# Add labels (commands) to networkx nodes

labels = {}

for el in elems:
    # if element is not a node
    if 'source' not in el:
        labels[el['index']] = el['data']['label']
                
nx.set_node_attributes(DG, labels, 'cmd')
nx.draw(DG, pos, with_labels=True, labels = labels)

# Add labels and data to each node object

def get_node_data_by_id():
    nodes_by_id = dict()
    for n, nd in DG.nodes().items():
        if n is not None:
            nodes_by_id[n] = nd
    return nodes_by_id

# Traverse tree in reverse topological sort 
# and add jobs to Redis queue

topological_sorting = nx.topological_sort(DG)
nodes_by_id = get_node_data_by_id()

print(nodes_by_id)

def jid(n):
    return 'JOB_ID_{0}'.format(n)

for n in topological_sorting:

    cmd = nodes_by_id[n]['cmd']
    ctrls = dict()

    if cmd.replace('.','',1).isdigit():
        ctrls['constant'] = cmd
        cmd = 'CONSTANT'   
    
    func = getattr(globals()[cmd], cmd)
    job_id = jid(n)

    s = ' '.join([STATUS_CODES['JOB_IN_RQ'], cmd.upper()])
    r.set('SYSTEM_STATUS', s)
    
    node_predecessors = DG.predecessors(n)
    
    if len(list(node_predecessors)) == 0:
        print ('{0} ({1}) has no predecessors'.format(cmd, n))
        q.enqueue(func, job_id = job_id, kwargs={'ctrls': ctrls})
    else:
        previous_job_ids = []
        for p in DG.predecessors(n):
            prev_cmd = DG.nodes[p]['cmd']
            prev_job_id = jid(p)
            previous_job_ids.append(prev_job_id)
            print(prev_cmd, 'is a predecessor to', cmd)
        q.enqueue(func,
            job_id = job_id,
            kwargs={'ctrls': ctrls, 'previous_job_ids': previous_job_ids},            
            depends_on = previous_job_ids)


# give jobs 5 seconds to execute :|
# TODO: make this set by user
time.sleep(5)

# collect node results
all_node_results = []
topological_sorting = nx.topological_sort(DG)

for n in topological_sorting:
    job_id = jid(n)
    nd = get_node_data_by_id()[n]
    job = Job.fetch(job_id, connection=r)
    redis_payload = job.result
    all_node_results.append({'cmd': nd['cmd'], 'result': redis_payload})

print('SYSTEM_STATUS', STATUS_CODES['RQ_RUN_COMPLETE'])

r.mset({'SYSTEM_STATUS': STATUS_CODES['RQ_RUN_COMPLETE'],
        'COMPLETED_JOBS': json.dumps(all_node_results, cls=PlotlyJSONEncoder)})
