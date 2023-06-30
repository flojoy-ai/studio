import json
import yaml
import os
from typing import Any, Union
from PYTHON.manifest.generate_yaml_manifest import create_manifest

Path = os.path
NODES_DIR = Path.join("PYTHON", "nodes")
FULL_PATH = Path.abspath(Path.join(Path.curdir, NODES_DIR))


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
            c_m = create_manifest(Path.join(dir_path, f"{Path.basename(dir_path)}.py"))
            result = c_m["COMMAND"][0]
            print("============================generated manifest for : ", f"{Path.basename(dir_path)}.py")
        except Exception as e:
            if "CONDITIONAL" in Path.basename(dir_path):
                print("error in generating manifest: ", e)
            with open(manifest_path, "r") as mf:
                m = mf.read()
                mf.close()
                parsed = yaml.load(m, Loader=yaml.FullLoader)
                m_c = parsed["COMMAND"][0]
                result = m_c
        result['type'] = Path.basename(Path.dirname(dir_path))
        result["children"] = None

    return result


if __name__ == "__main__":
    map = browse_directories(FULL_PATH)
    with open("src/data/manifests-latest.json", "w") as f:
        f.write(json.dumps(map, indent=3))
        f.close()
