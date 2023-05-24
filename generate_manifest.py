import json
from os import listdir
from os.path import isfile, join
import yaml

full_path = "PYTHON/nodes/MANIFEST"

manifest = {"_v": 0, "commands": list(), "parameters": dict()}


def open_prev_manifest():
    try:
        with open("src/data/manifests-latest.json", "r") as get_manifest:
            jsonify_manifest = json.load(get_manifest)
            return jsonify_manifest
    except:
        return False


prev_manifest = open_prev_manifest()

all_files = [f for f in listdir(full_path) if (isfile(join(full_path, f)))]
for mf in all_files:
    allowed_file_ext = [".manifest.yaml", ".manifest.yml"]
    if any(ext in mf for ext in allowed_file_ext):
        with open(join(full_path, mf), "r") as f:
            read_file = f.read()
            s = yaml.load(read_file, Loader=yaml.FullLoader)
            # Command always has to be a scalar list
            for item in s["COMMAND"]:
                exclude_property = ["parameters"]
                func_name = item["key"]
                manifest["commands"].append(
                    {x: item[x] for x in item if x not in exclude_property}
                )
                if "parameters" in item:
                    manifest["parameters"][func_name] = item["parameters"]

if prev_manifest != False:
    if len(manifest["commands"]) != len(prev_manifest["commands"]):
        jsonify_prev_manifest = json.dumps(obj=prev_manifest, indent=4)
        prev_file = open(
            "src/data/manifests_v." + str(prev_manifest["_v"]) + ".json", "w"
        )
        prev_file.write(jsonify_prev_manifest)
        prev_file.close()
        manifest["_v"] = prev_manifest["_v"] + 1
    else:
        manifest["_v"] = prev_manifest["_v"]

jsonify = json.dumps(obj=manifest, indent=4)
result = open("src/data/manifests-latest.json", "w")
result.write(jsonify)
result.close()
