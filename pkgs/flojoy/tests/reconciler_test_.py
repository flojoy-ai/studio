import numpy
import pandas
import unittest


from flojoy.data_container import DataContainer
from flojoy.reconciler import Reconciler, IrreconcilableContainersException


class ReconcilerTestCase(unittest.TestCase):
    def test_matrix_different_sizes(self):
        # create the two matrix datacontainers
        dc_a = DataContainer(type="Matrix", m=numpy.ones([2, 3]))

        dc_b = DataContainer(type="Matrix", m=numpy.ones([3, 2]))

        r = Reconciler()
        # function under test
        rec_a, rec_b = r.reconcile(dc_a, dc_b)

        self.assertTrue(
            numpy.array_equal(
                numpy.array([[1.0, 1.0, 1.0], [1.0, 1.0, 1.0], [0.0, 0.0, 0.0]]),
                rec_a.m,
            )
        )
        self.assertTrue(
            numpy.array_equal(
                numpy.array([[1.0, 1.0, 0.0], [1.0, 1.0, 0.0], [1.0, 1.0, 0.0]]),
                rec_b.m,
            )
        )

    def test_dataframe_different_sizes(self):
        # reconciler should take no action, as pandas operations are quite permissive already
        df_a = pandas.DataFrame(
            data={"col1": [1, 2, 3], "col2": [4, 5, 6], "col3": [7, 8, 9]}
        )
        df_b = pandas.DataFrame(data={"col2": [-1, -2], "col3": [-4, -5]})

        # create the two matrix datacontainers
        dc_a = DataContainer(type="DataFrame", m=df_a)
        dc_b = DataContainer(type="DataFrame", m=df_b)

        r = Reconciler()
        # function under test
        rec_a, rec_b = r.reconcile(dc_a, dc_b)

        self.assertTrue(rec_a.m.equals(df_a))
        self.assertTrue(rec_b.m.equals(df_b))

    def test_dataframe_scalar(self):
        # reconciler should expand the scalar to be the size of the DataFrame
        df_a = pandas.DataFrame(data={"col1": [1, 2, 3], "col2": [4, 5, 6]})
        df_b_new = pandas.DataFrame(data={"col1": [1, 1, 1], "col2": [1, 1, 1]})

        # create the two matrix datacontainers
        dc_a = DataContainer(type="DataFrame", m=df_a)
        dc_b = DataContainer(type="Scalar", c=1)

        r = Reconciler()
        # function under test
        rec_a, rec_b = r.reconcile(dc_a, dc_b)

        self.assertTrue(rec_a.m.equals(df_a))
        self.assertTrue(rec_b.m.equals(df_b_new))

    def test_complain_if_irreconcilable(self):
        dc_a = DataContainer(type="Grayscale")

        dc_b = DataContainer(
            type="OrderedPair", x=numpy.linspace(-10, 10, 100), y=[7] * 100
        )

        r = Reconciler()
        # function under test
        with self.assertRaises(IrreconcilableContainersException):
            rec_a, rec_b = r.reconcile(dc_a, dc_b)
