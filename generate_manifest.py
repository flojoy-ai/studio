import os
import json
import yaml
from typing import Any, Union
from PYTHON.manifest.generate_node_manifest import create_manifest
import traceback

Path = os.path
NODES_DIR = Path.join("PYTHON", "nodes")
FULL_PATH = Path.abspath(Path.join(Path.curdir, NODES_DIR))


__failed_nodes: list[str] = []
__generated_nodes: list[str] = []


def browse_directories(dir_path: str):
    result: dict[str, Union[str, list[Any], None]] = {}
    result["name"] = (
        "ROOT" if os.path.basename(dir_path) == "nodes" else Path.basename(dir_path)
    )
    if result["name"] != "ROOT":
        result["key"] = result["name"].upper().replace(" ", "_")
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
        manifest_path = Path.join(dir_path, "manifest.yml")
        if not Path.exists(manifest_path):
            manifest_path = Path.join(dir_path, "manifest.yaml")
        try:
            n_file_name = f"{Path.basename(dir_path)}.py"
            n_path = Path.join(dir_path, n_file_name)
            result = create_manifest(n_path)
            __generated_nodes.append(n_file_name)
        except Exception as e:
            if "LOOP" in dir_path:
                print(" e: ", e, traceback.format_exc())
            __failed_nodes.append(f"{Path.basename(dir_path)}.py")
            with open(manifest_path, "r") as mf:
                m = mf.read()
                mf.close()
                parsed = yaml.load(m, Loader=yaml.FullLoader)
                m_c = parsed["COMMAND"][0]
                result = m_c
        if not result.get("type"):
            result["type"] = Path.basename(Path.dirname(dir_path))
        result["children"] = None

    return result


if __name__ == "__main__":
    map = browse_directories(FULL_PATH)
    print(
        f"✅ Successfully generated manifest from {__generated_nodes.__len__()} nodes !"
    )
    print(
        f"⚠️ {__failed_nodes.__len__()} nodes require upgrading to align with the new API!"
    )
    with open("src/data/manifests-latest.json", "w") as f:
        f.write(json.dumps(map, indent=3))
        f.close()
