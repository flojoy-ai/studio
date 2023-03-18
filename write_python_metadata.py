import json
from os import listdir
from os.path import isfile, join

dirs = ['SIMULATIONS', 'ARITHMETIC', 'VISORS','CONDITIONALS','LOOPS','TIMERS', 'SIGNAL_PROCESSING','LOADERS', 'ARRAY_AND_MATRIX',
        "TERMINATORS"]

path = 'PYTHON/nodes'

badbadnotgood = ['VCTR.py', '__init__.py', '.DS_Store']

function_dict = dict()

for dir in dirs:
    function_dict[dir.rstrip('S')] = dict()
    full_path = path + '/' + dir
    python_files = [f for f in listdir(full_path) if (isfile(join(full_path, f)) and f not in badbadnotgood)]
    for pf in python_files:
        with open(join(full_path, pf)) as f:
            function_dict[dir.rstrip('S')][pf] = f.read()

s = json.dumps(function_dict)
result = open('src/feature/flow_chart_panel/manifest/pythonFunctions.json', 'w')
result.write(s)
result.close()

