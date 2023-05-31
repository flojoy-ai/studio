import fnmatch
import json
import os

nodes_dir = "PYTHON/nodes"

# The pattern to match for Python files
pattern = "*.py"

# List to store the file paths
file_paths: list[str] = []
badbadnotgood = ["VCTR.py", "__init__.py", ".DS_Store"]

# Walk through all the directories and subdirectories
for root, dirs, files in os.walk(nodes_dir):
    for file in files:
        # Check if the file matches the pattern
        if fnmatch.fnmatch(file, pattern):
            # If it matches, add the full path to the list
            if file not in badbadnotgood:
                file_paths.append(os.path.join(root, file))

# Print the list of file paths
function_dict: dict[str, dict[str, str]] = dict()
for single_file in file_paths:
    with open(single_file) as f:
        function_dict[os.path.basename(single_file)] = {
            "metadata": f.read(),
            "path": single_file,
        }

s = json.dumps(obj=function_dict, indent=2)
result = open("src/feature/flow_chart_panel/manifest/pythonFunctions.json", "w")
result.write(s)
result.write("\n")
result.close()
