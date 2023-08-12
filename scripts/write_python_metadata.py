import os
from flojoy_nodes.utils import write_metadata

if __name__ == "__main__":
    out_path = os.path.join(os.getcwd(), "src/data/pythonFunctions.json")
    custom_nodes_path = os.path.join(os.getcwd(), "PYTHON", "nodes")
    write_metadata(out_path=out_path, custom_nodes_dir=custom_nodes_path)
