import os
import yaml
from PYTHON.manifest import create_manifest


NODES_DIR = "PYTHON/nodes"


def main():
    for file in get_nodes_files(NODES_DIR):
        path = os.path.join(os.path.dirname(file), "manifest.yml")
        node_filename = os.path.basename(file)
        try:
            manifest = create_manifest(file)
            with open(path, "w+") as f:
                yaml.safe_dump(manifest, f, sort_keys=False, indent=2)
            print(f"✅ Wrote manifest for {node_filename}")
        except Exception as e:
            print(f"❌ Failed to generate manifest for {node_filename}, reason: {e}")
            continue


def get_nodes_files(root_dir: str) -> list[str]:
    result = []

    for root, _, files in os.walk(root_dir):
        if root == root_dir:
            continue

        node_files = filter(
            lambda file: file.endswith(".py") and file[:-3].isupper(), files
        )

        for file_name in node_files:
            file_path = os.path.join(root, file_name)
            result.append(file_path)

    return result


if __name__ == "__main__":
    main()
