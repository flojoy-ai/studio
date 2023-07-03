import ast
from typing import Optional, Any, Callable


def make_manifest_ast(path: str) -> ast.Module:
    with open(path) as f:
        tree = ast.parse(f.read())

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

    deps: list[Any] = []
    for package, ver in zip(kw.value.keys, kw.value.values):
        if not isinstance(package, ast.Constant) or not isinstance(ver, ast.Constant):
            raise ValueError("Pip dependencies must be a dictionary of strings")
        deps.append({"name": package.value, "v": ver.value})

    return deps


def find(collection: list[Any], predicate: Callable[[Any], bool]) -> Optional[Any]:
    return next(filter(predicate, collection), None)
