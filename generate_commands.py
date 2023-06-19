import json
from os.path import join
import yaml
import os

Path = os.path
NODES_DIR = join("PYTHON", "nodes")
FULL_PATH = Path.abspath(join(Path.curdir, NODES_DIR))


def browse_directories(dir_path: str):
    result = {}
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
        # if depth == 5:
        #     break
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
        with open(manifest_path, "r") as mf:
            m = mf.read()
            mf.close()
            parsed = yaml.load(m, Loader=yaml.FullLoader)
            m_c = parsed["COMMAND"][0]
            result = m_c
        result["children"] = None

    return result


map = browse_directories(FULL_PATH)
with open("generate_manifest.json", "w") as f:
    f.write(json.dumps(map, indent=3))
    f.close()
