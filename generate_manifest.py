import os
import json
from typing import Any, Union
from PYTHON.manifest.generate_node_manifest import create_manifest

Path = os.path
NODES_DIR = Path.join("PYTHON", "nodes")
FULL_PATH = Path.abspath(Path.join(Path.curdir, NODES_DIR))

NAME_MAP = {
    "AI_ML": "AI & ML",
    "EXTRACTORS": "Extract",
    "GENERATORS": "Generate",
    "INSTRUMENTS": "I/O",
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
}

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
]


__failed_nodes: list[str] = []
__generated_nodes: list[str] = []


def browse_directories(dir_path: str):
    result: dict[str, Union[str, list[Any], None]] = {}
    basename = Path.basename(dir_path)
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
            subdir = browse_directories(entry.path)
            result["children"].append(subdir)
        elif entry.is_file() and entry.name.endswith(".py"):
            continue
    if len(result["children"]) == 0:
        try:
            n_file_name = f"{Path.basename(dir_path)}.py"
            n_path = Path.join(dir_path, n_file_name)
            result = create_manifest(n_path)
            __generated_nodes.append(n_file_name)
        except Exception as e:
            print(
                "❌ Failed to generate manifest from ",
                f"{Path.basename(dir_path)}.py ",
                e,
                "\n",
            )
            __failed_nodes.append(f"{Path.basename(dir_path)}.py")

        if not result.get("type"):
            result["type"] = Path.basename(Path.dirname(dir_path))
        result["children"] = None

    return result


def sort_order(element):
    try:
        return ORDERING.index(element["key"])
    except ValueError:
        return len(ORDERING)


if __name__ == "__main__":
    map = browse_directories(FULL_PATH)
    map["children"].sort(key=sort_order)  # type: ignore

    print(
        f"✅ Successfully generated manifest from {__generated_nodes.__len__()} nodes !"
    )
    print(
        f"⚠️ {__failed_nodes.__len__()} nodes require upgrading to align with the new API!"
    )
    with open("src/data/manifests-latest.json", "w") as f:
        f.write(json.dumps(map, indent=3))
        f.close()