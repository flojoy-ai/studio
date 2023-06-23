import ast
from typing import Any, Optional

SELECTED_IMPORTS = ["flojoy_mock", "dataclasses", "typing"]


class FlojoyNodeTransformer(ast.NodeTransformer):
    def has_decorator(
        self, node: ast.FunctionDef | ast.ClassDef, decorator_name: str
    ) -> bool:
        if not node.decorator_list:
            return False

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

    def visit_Module(self, node: ast.Module):
        node.body = [self.visit(n) for n in node.body]
        return node

    def visit_Import(self, node: ast.Import):
        if node.names[0].name in SELECTED_IMPORTS:
            return node
        return None

    def visit_ImportFrom(self, node):
        if node.module in SELECTED_IMPORTS:
            return node
        return None

    def visit_ClassDef(self, node: ast.ClassDef):
        if not self.has_decorator(node, "dataclass"):
            return None
        return node

    def visit_FunctionDef(self, node: ast.FunctionDef):
        if not self.has_decorator(node, "flojoy"):
            return None

        # Line numbers and col offset must be preserved for compiler to be happy
        if node.body:
            node.body = [
                ast.Pass(lineno=node.body[0].lineno, col_offset=node.body[0].col_offset)
            ]
        else:
            node.body = [ast.Pass(lineno=node.lineno, col_offset=node.col_offset)]

        return node

    def generic_visit(self, node):
        return None


def make_manifest_ast(path: str) -> ast.Module:
    with open(path) as f:
        tree = ast.parse(f.read())

    # Do an initial pass to remove everything that isnt an
    # import, dataclass or flojoy node
    transformer = FlojoyNodeTransformer()
    tree: ast.Module = transformer.visit(tree)

    flojoy_nodes = [node for node in tree.body if isinstance(node, ast.FunctionDef)]
    if not flojoy_nodes:
        raise ValueError("No flojoy node found in file")

    flojoy_node = flojoy_nodes[0]
    if not flojoy_node.returns or not isinstance(flojoy_node.returns, ast.Name):
        raise ValueError(
            "Flojoy node must have a dataclass or DataContainer return type hint"
        )

    # Then get rid of all the other dataclasses
    # that aren't the return type of the flojoy node
    # This also filters out all of the None values
    return_type = flojoy_node.returns.id
    tree.body = [
        node
        for node in tree.body
        if node and (not isinstance(node, ast.ClassDef) or node.name == return_type)
    ]

    return tree


def get_pip_dependencies(tree: ast.Module) -> Optional[list[dict[str, str]]]:
    flojoy_nodes = [node for node in tree.body if isinstance(node, ast.FunctionDef)]
    if not flojoy_nodes:
        raise ValueError("No flojoy node found in file")

    is_decorator_with_deps = (
        lambda d: isinstance(d, ast.Call)
        and isinstance(d.func, ast.Name)
        and d.func.id == "flojoy"
    )

    flojoy_node = flojoy_nodes[0]
    # Differentiates between @flojoy and @flojoy(deps={...})
    decorator = next(filter(is_decorator_with_deps, flojoy_node.decorator_list), None)

    # If it's just @flojoy then there are no dependencies
    if not decorator or not isinstance(decorator, ast.Call):
        return None

    # Look for the deps keyword
    kw = next(filter(lambda k: k.arg == "deps", decorator.keywords), None)

    if not kw:
        return None

    if not isinstance(kw.value, ast.Dict):
        raise ValueError("Pip dependencies must be a dictionary")

    deps = []
    for package, ver in zip(kw.value.keys, kw.value.values):
        if not isinstance(package, ast.Constant) or not isinstance(ver, ast.Constant):
            raise ValueError("Pip dependencies must be a dictionary of strings")
        deps.append({"name": package.value, "v": ver.value})

    return deps
