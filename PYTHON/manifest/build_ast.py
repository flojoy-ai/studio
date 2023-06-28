import ast
from typing import Optional, Any, Callable

SELECTED_IMPORTS = ["flojoy", "dataclasses", "typing"]


class FlojoyNodeTransformer(ast.NodeTransformer):
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

    def visit_Module(self, node: ast.Module):
        node.body = [self.visit(n) for n in node.body]
        return node

    def visit_Import(self, node: ast.Import):
        if node.names[0].name in SELECTED_IMPORTS:
            return node
        return None

    def visit_ImportFrom(self, node: ast.ImportFrom):
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

    flojoy_node = find(tree.body, lambda node: isinstance(node, ast.FunctionDef))

    if not flojoy_node:
        raise ValueError("No flojoy node found in file")

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


def get_flojoy_decorator(tree: ast.Module) -> Optional[ast.Call]:
    flojoy_node = find(tree.body, lambda node: isinstance(node, ast.FunctionDef))
    if not flojoy_node:
        raise ValueError("No flojoy node found in file")

    # Differentiates between @flojoy and @flojoy(deps={...})
    return find(
        flojoy_node.decorator_list,
        lambda d: isinstance(d, ast.Call)
        and isinstance(d.func, ast.Name)
        and d.func.id == "flojoy",
    )


def get_flojoy_decorator_param(tree: ast.Module, name: str) -> Optional[ast.keyword]:
    decorator = get_flojoy_decorator(tree)
    if not decorator:
        return None

    return find(decorator.keywords, lambda k: k.arg == name)


def get_pip_dependencies(tree: ast.Module) -> Optional[list[dict[str, str]]]:
    kw = get_flojoy_decorator_param(tree, "deps")

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


def get_node_type(tree: ast.Module) -> Optional[str]:
    kw = get_flojoy_decorator_param(tree, "node_type")
    if not kw:
        return None
    if not isinstance(kw.value, ast.Constant):
        raise ValueError("Node type must be a string")
    return kw.value.value


def find(collection: list[Any], predicate: Callable[[Any], bool]) -> Optional[Any]:
    return next(filter(predicate, collection), None)
