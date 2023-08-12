import os
from flojoy_nodes.utils import generate_manifest

if __name__ == "__main__":
    out_path = os.path.join(os.getcwd(), "src/data/manifests-latest.json")
    custom_nodes_path = os.path.join(os.getcwd(), "PYTHON", "nodes")
    generate_manifest(
        out_path=out_path, custom_nodes_path=custom_nodes_path, root_dir="nodes"
    )
