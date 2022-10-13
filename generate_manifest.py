import json
from os import listdir
from os.path import isfile, join
import yaml

full_path = 'PYTHON/FUNCTIONS/MANIFEST'

manifest = {
    'commands': list(),
    'parameters':dict()
}

all_files = [f for f in listdir(full_path) if (isfile(join(full_path, f)))]
for mf in all_files:
    if '.manifest.yaml' in mf:
        # print('manifest is in: ', mf)
        with open(join(full_path, mf), 'r') as f:
            read_file = f.read()
            s = yaml.load(read_file, Loader=yaml.FullLoader)
            # Command always has to be a scalar list
            for item in s['COMMAND']:
                exclude_property = ['parameters']
                func_name = item['key']
                manifest['commands'].append({x: item[x] for x in item if x not in exclude_property})
                if 'parameters' in item:
                    manifest['parameters'][func_name] = item['parameters']

jsonify = json.dumps(manifest)
result = open('src/data/manifests.json', 'w')
result.write(jsonify)
result.close()