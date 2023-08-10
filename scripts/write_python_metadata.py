import os
from flojoy_nodes.utils import write_metadata

if __name__ == "__main__":
    out_path = os.path.join(os.getcwd(), "src/data/pythonFunctions.json")
    write_metadata(out_path=out_path)
