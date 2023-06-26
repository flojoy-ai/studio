import os
import yaml
from types import ModuleType
from build_ast import get_pip_dependencies, make_manifest_ast
from manifest import make_manifest_for


NODES_DIR = "../nodes"


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


def create_manifest(path: str) -> dict:
    tree = make_manifest_ast(path)
    code = compile(tree, filename="<unknown>", mode="exec")
    module = ModuleType("node_module")
    exec(code, module.__dict__)

    filename = os.path.basename(path)[:-3]
    func = getattr(module, filename)
    manifest = make_manifest_for("ARITHMETIC", func)

    pip_deps = get_pip_dependencies(tree)
    if pip_deps:
        manifest["COMMAND"][0]["pip_dependencies"] = pip_deps

    return manifest


def main():
    for file in get_nodes_files(NODES_DIR):
        try:
            manifest = create_manifest(file)
            with open(os.path.join(os.path.dirname(file), "manifest.yaml"), "w") as f:
                yaml.safe_dump(manifest, f, sort_keys=False, indent=2)
            print(f"Wrote manifest for {os.path.basename(file)}")
        except Exception as e:
            # print(f"Failed to generate manifest for {file}, reason: {e}")
            continue


if __name__ == "__main__":
    main()
