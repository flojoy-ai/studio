from os import listdir
from os.path import isfile, join
import json
import os


def update_example_app(file_path):
    with open(join(file_path), 'r') as f:
        text_data = f.read()
        load_json = json.loads(text_data)
        grid_layout = load_json.get("gridLayout", [])
        def update_ctrl_input(data: dict):
            # for l in grid_layout:
            #     print(" l here: ", l)
            #     if l["i"] == data['id']:
            #         data['layout'] = l
            return data
        ctrl_manifest = load_json.get("ctrlsManifest", [])
        update_ctrl = list(map(update_ctrl_input, ctrl_manifest))
        update_file = {
            **load_json,
            "ctrlsManifest": update_ctrl,
            "gridLayout": []
        }
        update_file.__delitem__("gridLayout")
        print("update_file: ", update_file)
        print("\n\n\n\n")
        open_file = open(join(file_path), 'w')
        open_file.write(json.dumps(obj=update_file, indent=4))
        open_file.close()


folder_path ="./apps"
#we shall store all the file names in this list
filelist = []

for root, dirs, files in os.walk(folder_path):
    for file in files:
        #append the file name to the list
        filelist.append(os.path.join(root,file))
for paths in filelist:
    if paths.endswith(".txt"):
        print(" a txt file: ", paths, '\n')
        update_example_app(paths)
