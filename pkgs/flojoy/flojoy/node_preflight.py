def node_preflight(func):
    func.is_flojoy_preflight = True
    return func
