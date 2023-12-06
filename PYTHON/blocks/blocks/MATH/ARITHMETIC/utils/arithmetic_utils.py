from flojoy import OrderedPair, Scalar, Vector, DCNpArrayType


def get_val(
    data_container: OrderedPair | Scalar | Vector,
) -> DCNpArrayType:
    match data_container:
        case OrderedPair():
            return data_container.y
        case Scalar():
            return data_container.c
        case Vector():
            return data_container.v
