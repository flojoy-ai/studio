import fnmatch
import os
from captain.utils.nodes_path import get_nodes_path

# The pattern to match for Python files
pattern = "*.py"

badbadnotgood = ["__init__.py"]
ignore_folders = [
    "venv",
]


def get_file_paths(nodes_dir: str):
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
    nodes_path = get_nodes_path()
    file_paths = get_file_paths(nodes_path)
    # Print the list of file paths
    metadata_map: dict[str, dict[str, str]] = dict()
    for single_file in file_paths:
        with open(single_file) as f:
            file_path = single_file.replace("\\", "/")
            file_path = file_path[file_path.rfind("nodes/") + 6 :]
            metadata_map[os.path.basename(single_file)] = {
                "metadata": f.read(),
                "path": file_path,
            }
    return metadata_map
