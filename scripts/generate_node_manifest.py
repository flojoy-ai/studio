import os
from flojoy_nodes.utils import generate_manifest

if __name__ == "__main__":
    out_path = os.path.join(os.getcwd(), "src/data/manifest-latest.json")
    generate_manifest(out_path=out_path)
