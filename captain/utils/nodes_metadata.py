import fnmatch
import json
import os

nodes_dir = "PYTHON/nodes"

# The pattern to match for Python files
pattern = "*.py"

badbadnotgood = ["VCTR.py", "__init__.py", ".DS_Store"]
ignore_folders = [
    "venv",
]


def get_file_paths():
    # List to store the file paths
    file_paths: list[str] = []
    # Walk through all the directories and subdirectories
    for root, dirs, files in os.walk(nodes_dir):
        for file in files:
            # Check if the file matches the pattern
            if any(
                folder_name in os.path.join(root, file)
                for folder_name in ignore_folders
            ):
                continue
            if fnmatch.fnmatch(file, pattern):
                # If it matches, add the full path to the list
                if file not in badbadnotgood:
                    file_paths.append(os.path.join(root, file))

    return file_paths


def generate_metadata():
    file_paths = get_file_paths()
    # Print the list of file paths
    metadata_map: dict[str, dict[str, str]] = dict()
    for single_file in file_paths:
        with open(single_file) as f:
            metadata_map[os.path.basename(single_file)] = {
                "metadata": f.read(),
                "path": single_file,
            }
    return metadata_map
