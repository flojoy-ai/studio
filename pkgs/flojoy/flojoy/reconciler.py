"""
Nodes should try to accomodate any reasonable combination of inputs that a first-time Flojoy Studio user might try.

For example, the ADD node should make a best effort to do something reasonable when a matrix is added to a DataFrame, or a 2 matrices of a different size are added.

For this reason, we've created the `Reconciler` class to handle the process of turning different data types into compatible, easily added objects. 
"""
from typing import Tuple
import numpy

from .data_container import DataContainer


class IrreconcilableContainersException(Exception):
    pass


class Reconciler:
    def __init__(self, pad: float = 0):
        self.pad = pad

    def reconcile(
        self, lhs: DataContainer, rhs: DataContainer
    ) -> Tuple[DataContainer, DataContainer]:
        types_to_reconcile = set([lhs.type, rhs.type])
        if types_to_reconcile == set(["Matrix"]):
            return self.reconcile_matrix(lhs, rhs)
        elif types_to_reconcile == set(["DataFrame"]):
            return self.reconcile_dataframe(lhs, rhs)
        elif types_to_reconcile == set(["OrderedPair"]):
            return self.reconcile_ordered_pair(lhs, rhs)
        elif types_to_reconcile == set(["Matrix", "Scalar"]):
            return self.reconcile_matrix_scalar(lhs, rhs)
        elif types_to_reconcile == set(["Matrix", "DataFrame"]):
            return self.reconcile_dataframe_matrix(lhs, rhs)
        elif types_to_reconcile == set(["Scalar", "DataFrame"]):
            return self.reconcile_dataframe_scalar(lhs, rhs)
        else:
            raise IrreconcilableContainersException(
                "FloJoy doesn't know how to reconcile data containers of type %s and %s"
                % (lhs.type, rhs.type)
            )

    def reconcile_matrix(
        self, lhs: DataContainer, rhs: DataContainer
    ) -> Tuple[DataContainer, DataContainer]:
        # make the matrices equal sizes, by padding
        final_r = max(lhs.m.shape[0], rhs.m.shape[0])
        final_c = max(lhs.m.shape[1], rhs.m.shape[1])

        new_lhs = numpy.pad(
            lhs.m,
            ((0, final_r - lhs.m.shape[0]), (0, final_c - lhs.m.shape[1])),
            "constant",
            constant_values=self.pad,
        )
        new_rhs = numpy.pad(
            rhs.m,
            ((0, final_r - rhs.m.shape[0]), (0, final_c - rhs.m.shape[1])),
            "constant",
            constant_values=self.pad,
        )

        return (
            DataContainer(type="Matrix", m=new_lhs),
            DataContainer(type="Matrix", m=new_rhs),
        )

    def reconcile_dataframe(
        self, lhs: DataContainer, rhs: DataContainer
    ) -> Tuple[DataContainer, DataContainer]:
        # pandas' handling for DataFrames is actually pretty permissive. Let's just
        #  return both types as normal
        return (lhs, rhs)

    def reconcile_dataframe_scalar(
        self, lhs: DataContainer, rhs: DataContainer
    ) -> Tuple[DataContainer, DataContainer]:
        # let's expand the scalar to be a DataFrame the same size as the other DataFrame
        if lhs.type == "DataFrame":
            new_m = lhs.m.copy()
            new_m.iloc[:] = rhs.c
            return lhs, DataContainer(type="DataFrame", m=new_m)

        new_m = rhs.m.copy()
        new_m.iloc[:] = lhs.c
        return DataContainer(type="DataFrame", m=new_m), rhs

    def reconcile_ordered_pair(
        self, lhs: DataContainer, rhs: DataContainer
    ) -> Tuple[DataContainer, DataContainer]:
        raise NotImplementedError("TODO")

    def reconcile_matrix_scalar(
        self, lhs: DataContainer, rhs: DataContainer
    ) -> Tuple[DataContainer, DataContainer]:
        raise NotImplementedError("TODO")

    def reconcile_dataframe_matrix(
        self, lhs: DataContainer, rhs: DataContainer
    ) -> Tuple[DataContainer, DataContainer]:
        raise NotImplementedError("TODO")
