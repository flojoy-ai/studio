import os
from flojoy.node_utils.generate_manifest import generate_manifest

if __name__ == "__main__":
  out_path = os.path.join(os.getcwd(), "src/data/manifest-latest.json")
  generate_manifest(out_path=out_path)
