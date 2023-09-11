import os
from typing import Any, Optional, Union
from captain.utils.manifest.build_manifest import create_manifest
from captain.utils.nodes_path import get_nodes_path

__all__ = ["generate_manifest"]

NAME_MAP = {
    "AI_ML": "AI & ML",
    "EXTRACTORS": "Extract",
    "GENERATORS": "Generate",
    "IO": "I/O",
    "LOGIC_GATES": "Logic",
    "LOADERS": "Load",
    "TRANSFORMERS": "Transform",
    "VISUALIZERS": "Visualize",
    "NUMPY": "numpy",
    "LINALG": "np.linalg",
    "RANDOM": "np.rand",
    "SCIPY": "scipy",
    "SIGNAL": "sp.signal",
    "STATS": "sp.stats",
    "GAMES": "Games",
}

# Types that are allowed in the manifest, this is for styling in the frontend.
# A node will inherit the type of its parent if it is not in the allowed types.
ALLOWED_TYPES = [
    "AI_ML",
    "GENERATORS",
    "VISUALIZERS",
    "LOADERS",
    "EXTRACTORS",
    "TRANSFORMERS",
    "ARITHMETIC",
    "IO",
    "LOGIC_GATES",
    "CONDITIONALS",
    "NUMPY",
    "GAMES",
    "SCIPY",
]

# Sort order in sidebar
ORDERING = [
    "AI_ML",
    "GENERATORS",
    "VISUALIZERS",
    "EXTRACTORS",
    "TRANSFORMERS",
    "LOADERS",
    "INSTRUMENTS",
    "LOGIC_GATES",
    "NUMPY",
    "SCIPY",
    "GAMES",
]


def browse_directories(dir_path: str, cur_type: Optional[str] = None):
    result: dict[str, Union[str, list[Any], None]] = {}
    basename = os.path.basename(dir_path)
    result["name"] = (
        "ROOT"
        if os.path.basename(dir_path) == "nodes"
        else NAME_MAP.get(basename, basename)
    )
    if result["name"] != "ROOT":
        result["key"] = basename

    result["children"] = []
    entries = sorted(
        os.scandir(dir_path), key=lambda e: e.name
    )  # Sort entries alphabetically

    for entry in entries:
        if entry.is_dir():
            if (
                entry.name.startswith(".")
                or entry.name.startswith("_")
                or entry.name == "assets"
                or entry.name == "utils"
                or entry.name == "MANIFEST"
                or "examples" in entry.path
                or "a1-[autogen]" in entry.path
                or "appendix" in entry.path
            ):
                continue
            cur_type = basename if basename in ALLOWED_TYPES else cur_type
            subdir = browse_directories(entry.path, cur_type)
            result["children"].append(subdir)
        elif entry.is_file() and entry.name.endswith(".py"):
            continue
    if not result["children"] and os.listdir(dir_path):
        try:
            n_file_name = f"{os.path.basename(dir_path)}.py"
            n_path = os.path.join(dir_path, n_file_name)
            result = create_manifest(n_path)
        except Exception as e:
            raise ValueError(
                f"Failed to generate manifest from {os.path.basename(dir_path)}.py {', '.join(e.args)}"
            )

        if not result.get("type"):
            result["type"] = cur_type
        result["children"] = None

    return result


def sort_order(element):
    try:
        return ORDERING.index(element["key"])
    except ValueError:
        return len(ORDERING)


def generate_manifest():
    nodes_path = get_nodes_path()
    nodes_map = browse_directories(nodes_path)
    nodes_map["children"].sort(key=sort_order)  # type: ignore
    return nodes_map
