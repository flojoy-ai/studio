import fnmatch
import json
import os

rootdir = "PYTHON/nodes"

# The pattern to match for Python files
pattern = "*.py"

# List to store the file paths
file_paths = []
badbadnotgood = ["VCTR.py", "__init__.py", ".DS_Store"]

# Walk through all the directories and subdirectories
for subdir, dirs, files in os.walk(rootdir):
    for file in files:
        # Check if the file matches the pattern
        if fnmatch.fnmatch(file, pattern):
            # If it matches, add the full path to the list
            if file not in badbadnotgood:
                file_paths.append(os.path.join(subdir, file))

# Print the list of file paths
function_dict = dict()
for single_file in file_paths:
    with open(single_file) as f:
        function_dict[os.path.basename(single_file)] = f.read()

s = json.dumps(obj=function_dict, indent=2)
result = open("src/data/pythonFunctions.json", "w")
result.write(s)
result.write("\n")
result.close()
