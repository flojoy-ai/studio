import astunparse, ast

def convert_numpy_to_ulab(file: str):
    """
    Convert numpy imports to ulab imports
    """
    tree = ast.parse(file)

    class ReplaceNumpyImport(ast.NodeTransformer):
        def visit_Import(self, node): # this function is overridden, called during visit()
            new_nodes = []
            for alias in node.names:
                if alias.name == 'numpy':
                    # Create new ImportFrom node
                    new_alias = ast.alias(name='numpy', asname=alias.asname)
                    new_node = ast.ImportFrom(module='ulab', names=[new_alias], level=0)
                    new_nodes.append(new_node)
                else:
                    # Keep other imports unchanged
                    new_nodes.append(node)
            return new_nodes if len(new_nodes) > 1 else new_nodes[0]

    transformer = ReplaceNumpyImport()
    new_tree = transformer.visit(tree)
    new_file = astunparse.unparse(new_tree)
    return new_file