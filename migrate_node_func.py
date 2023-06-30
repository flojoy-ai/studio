from _ast import Assign, ImportFrom
import os
import ast
import yaml
from typing import Any
from PYTHON.manifest.generate_yaml_manifest import create_manifest


def get_nodes_files(root_dir: str) -> list[str]:
    result: list[str] = []

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





def get_parameter_annotation(param_type: str, param_value: Any):
    match param_type:
        case "array":
            return ast.Name(id="list[str | float | int]"), None
        case "node_reference" | "string":
            return ast.Name(id="str"), None
        case "boolean":
            return ast.Name(id="bool"), None
        case "select":
            options = param_value["options"]
            return ast.Subscript(
                value=ast.Name(id="Literal", ctx=ast.Load()),
                slice=ast.Index(
                    value=ast.Tuple(
                        elts=[ast.Constant(value=option) for option in options],
                        ctx=ast.Load(),
                    )
                ),
                ctx=ast.Load(),
            ), {"module": "typing", "name": "Literal"}
        case _:
            return ast.Name(id=param_type), None


def get_parameter_args(parameters: dict[str, dict[str, Any]]):
    args: list[ast.arg] = []
    defaults: list[ast.expr] = []
    extra_import: dict[str, Any] | None = None
    for name, item in parameters.items():
        annotation, need_import = get_parameter_annotation(item["type"], item)
        extra_import = need_import
        args.append(
            ast.arg(
                arg=name,
                annotation=annotation,
                default=ast.Constant(value=item["default"]),
            )
        )
        defaults.append(
            ast.Constant(value=item["default"] if item["type"] != "array" else [])
        )
    return args, defaults, extra_import


NODE_LIST = []


class FunctionDeclarationVisitor(ast.NodeTransformer):
    def __init__(self, node_path: str):
        self.node_path = node_path
        self.add_import: dict[str, Any] | None = None
        self.assignments: list[Assign] = []
        self.variables: list[str] = []
    
    def visit_Module(self, node: ast.Module):
        node.body = [self.visit(n) for n in node.body]
        if self.add_import:
            print(" creating import statement:")
            # Create an ImportFrom node for "from typing import Literal"
            import_literal = ast.ImportFrom(
                module=self.add_import["module"],
                names=[ast.alias(name=self.add_import["name"], asname=None)],
                level=0,
            )

            # Insert the ImportFrom node at the beginning of the module's body
            node.body.insert(0, import_literal)

        return node
    def visit_ImportFrom(self, node: ImportFrom) -> Any:
        if node.module == 'flojoy':
            node.names.append(ast.alias(name='DefaultParams'))
        return node

    def get_manifest(self, node_path: str):
        if node_path.endswith(".py"):
            node_path = os.path.dirname(node_path)
        manifest_path = os.path.join(node_path, "manifest.yml")
        if not os.path.exists(manifest_path):
            manifest_path = os.path.join(node_path, "manifest.yaml")
        with open(manifest_path, "r") as mf:
            m = mf.read()
            mf.close()
        parsed = yaml.load(m, Loader=yaml.FullLoader)
        m_c = parsed["COMMAND"][0]
        result = m_c
        return result

    def has_decorator(
        self, node: ast.FunctionDef | ast.ClassDef, decorator_name: str
    ) -> bool:
        for decorator in node.decorator_list:
            if isinstance(decorator, ast.Name) and decorator.id == decorator_name:
                return True
            elif (
                isinstance(decorator, ast.Call)
                and isinstance(decorator.func, ast.Name)
                and decorator.func.id == decorator_name
            ):
                return True

        return False

    def visit_FunctionDef(self, node: ast.FunctionDef):
        # Modify function declarations here
        if not self.has_decorator(node, "flojoy"):
            return node
        if "MOCK" in node.name:
            return node
        if node.name not in NODE_LIST:
            manifest = self.get_manifest(self.node_path)
            node_args: list[ast.arg] = []
            defaults: list[ast.expr] = []
            if "outputs" in manifest:
                return node
            if "inputs" in manifest:
                for input in manifest["inputs"]:
                    if input["type"] not in ["source", "target"]:
                        continue
                    if input["type"] == "source":
                        continue
                    self.variables.append(input['name'])
                    node_args.append(
                        ast.arg(
                            arg=input["name"] if input["name"] != "" else input["id"],
                            annotation=ast.Name(id="DataContainer", ctx=ast.Load()),
                        )
                    )
            if node_args.__len__() == 0:
                node_args.append(
                    ast.arg(
                        arg="default",
                        annotation=ast.Name(id="DataContainer", ctx=ast.Load()),
                    )
                )
            node_args.append(ast.arg(arg="default_parmas", annotation=ast.Name(id="DefaultParams", ctx=ast.Load())))

            if "parameters" in manifest:
                param_args, param_defaults, extraImport = get_parameter_args(
                    manifest["parameters"]
                )
                self.variables = [param for param in manifest['parameters'].keys()]
                self.add_import = extraImport
                node_args = node_args + param_args
                defaults = defaults + param_defaults

            node.args.args = node_args
            node.args.defaults = defaults
            # Find and remove assignments of variables
            node.body = [stmt for stmt in node.body if not self._is_assignment_of_variables(stmt)]
        
        return node
    def _is_assignment_of_variables(self, node:ast.stmt):
        if isinstance(node, ast.Assign):
            for target in node.targets:
                if isinstance(target, ast.Name) and target.id in self.variables:
                    return True
        return False

def modify_func(node_files: list[str]):
    for n_path in node_files:

        # if any(node_name in os.path.basename(n_path) for node_name in NODE_LIST):
        with open(n_path, "r") as f:
            content = f.read()
        tree = ast.parse(content)
        visitor = FunctionDeclarationVisitor(node_path=n_path)
        u_tree = visitor.visit(tree)

        modified_content = ast.unparse(u_tree)

        # print(" modified function: ", modified_content)
        with open(n_path, "w") as n_f:
            n_f.write(modified_content)
            n_f.close()


if __name__ == "__main__":
    root_dir = os.path.abspath(os.path.join(os.curdir, "PYTHON", "nodes"))
    nodes = get_nodes_files(root_dir)
    modify_func(nodes)
    print(" nodes: ", nodes.__len__())
