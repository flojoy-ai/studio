from typing import Optional
import functools


def flojoy(original_function=None, *, deps: Optional[dict[str, str]] = None):
    def decorator(func):
        # This is the actual decorator
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            # Decorator logic using the parameters
            result = func(*args, **kwargs)
            return result

        return wrapper

    if original_function:
        return decorator(original_function)

    return decorator


class DataContainer:
    pass


class OrderedPair(DataContainer):
    pass


class OrderedTriple(DataContainer):
    pass


class Matrix(DataContainer):
    pass


class Dataframe(DataContainer):
    pass


if __name__ == "__main__":
    a = OrderedPair()
    print(isinstance(a, DataContainer))
