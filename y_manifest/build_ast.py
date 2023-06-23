import ast
from typing import Any

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

    def visit_Module(self, node: ast.Module) -> Any:
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

    def visit_ClassDef(self, node: ast.ClassDef) -> Any:
        if not self.has_decorator(node, "dataclass"):
            return None
        return node

    def visit_FunctionDef(self, node: ast.FunctionDef) -> Any:
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


def make_manifest_ast(path: str):
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

    # TODO: Get pip dependencies out of the decorator

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


def main():
    pass


if __name__ == "__main__":
    main()
