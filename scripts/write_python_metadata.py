import os
from flojoy.node_utils.write_python_metadata import write_metadata

if __name__ == "__main__":
    out_path = os.path.join(os.getcwd(), "src/data/pythonFunctions.json")
    write_metadata(out_path=out_path)