import os
from typing import Any, Optional, Union

from captain.utils.blocks_path import get_blocks_path
from captain.utils.manifest.build_manifest import create_manifest

__all__ = ["generate_manifest"]

NAME_MAP = {
    "AI_ML": "AI & ML",
    "DATA": "Data",
    "DSP": "Digital Signal Processing",
    "IMAGE": "Image",
    "HARDWARE": "Hardware",
    "CONTROL_FLOW": "Control Flow",
    "MATH": "Math",
    "DEBUGGING": "Debugging",
    "ETL": "ETL",
    "NUMPY": "numpy",
    "LINALG": "np.linalg",
    "RANDOM": "np.rand",
    "SCIPY": "scipy",
    "SIGNAL": "sp.signal",
    "STATS": "sp.stats",
    "GAMES": "Games",
    "COMPUTER_VISION": "Computer Vision",
    "default": "Default Blocks",
    "TYPE_CASTING": "Type Casting",
}

# Types that are allowed in the manifest, this is for styling in the frontend.
# A node will inherit the type of its parent if it is not in the allowed types.
ALLOWED_TYPES = [
    "AI_ML",
    "DATA",
    "VISUALIZATION",
    "MATH",
    "ARITHMETIC",
    "ETL",
    "DSP",
    "IMAGE",
    "CONTROL_FLOW",
    "CONDITIONALS",
    "HARDWARE",
    "NUMPY",
    "SCIPY",
    "GAMES",
    "DEBUGGING",
    "COMPUTER_VISION",
    "EXTRACT",
    "LOAD",
    "TRANSFORM",
    "TYPE_CASTING",
]

# Sort order in sidebar
ORDERING = [
    "AI_ML",
    "DATA",
    "MATH",
    "ETL",
    "DSP",
    "IMAGE",
    "CONTROL_FLOW",
    "COMPUTER_VISION",
    "HARDWARE",
    "NUMPY",
    "SCIPY",
    "DEBUGGING",
]


def browse_directories(dir_path: str, cur_type: Optional[str] = None, depth: int = 0):
    result: dict[str, Union[str, list[Any], None]] = {}
    basename = os.path.basename(dir_path)
    result["name"] = "ROOT" if depth == 0 else NAME_MAP.get(basename, basename)
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
                or not os.listdir(entry)
            ):
                continue

            cur_type = (
                basename
                if basename in ALLOWED_TYPES  # give current type precedence
                else (
                    cur_type
                    if cur_type in ALLOWED_TYPES  # otherwise inherit if allowed
                    else "default"
                )  # else use default
            )

            subdir = browse_directories(entry.path, cur_type, depth=depth + 1)
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
                f"Failed to generate manifest from {os.path.basename(dir_path)}.py, reason: {str(e)}"
            )

        if not result.get("type"):
            result["type"] = cur_type
        result["children"] = None

    return result


def sort_order(element: dict[str, Any]):
    try:
        return ORDERING.index(element["key"])
    except ValueError:
        return len(ORDERING)


def generate_manifest(blocks_path: str | None):
    blocks_path = blocks_path if blocks_path else get_blocks_path()
    blocks_map = browse_directories(blocks_path)
    blocks_map["children"].sort(key=sort_order)  # type: ignore
    return blocks_map
