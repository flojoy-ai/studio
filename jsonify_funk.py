import json
from os import listdir
from os.path import isfile, join

dirs = ['GENERATORS', 'TRANSFORMERS', 'VISORS']

path = 'PYTHON/FUNCTIONS'

badbadnotgood = ['VCTR.py', '__init__.py', '.DS_Store']

function_dict = dict()

for dir in dirs:
    function_dict[dir] = dict()
    full_path = path + '/' + dir
    print(full_path)
    python_files = [f for f in listdir(full_path) if (isfile(join(full_path, f)) and f not in badbadnotgood)]
    for pf in python_files:
        print(pf)
        with open(join(full_path, pf)) as f:
            function_dict[dir][pf] = f.read()

s = json.dumps(function_dict)
result = open('src/components/flow_chart_panel/pythonFunctions.json', 'w')
result.write(s)
result.close()
    
