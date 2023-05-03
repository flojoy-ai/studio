import decimal
import json as _json

import numpy as np
import pandas as pd


class PlotlyJSONEncoder(_json.JSONEncoder):
    """
    Meant to be passed as the `cls` kwarg to json.dumps(obj, cls=..)
    See PlotlyJSONEncoder.default for more implementation information.
    Additionally, this encoder overrides nan functionality so that 'Inf',
    'NaN' and '-Inf' encode to 'null'. Which is stricter JSON than the Python
    version.
    """

    def coerce_to_strict(self, const):
        """
        This is used to ultimately *encode* into strict JSON, see `encode`
        """
        # before python 2.7, 'true', 'false', 'null', were include here.
        if const in ("Infinity", "-Infinity", "NaN"):
            return None
        else:
            return const

    def encode(self, o):
        """
        Load and then dump the result using parse_constant kwarg
        Note that setting invalid separators will cause a failure at this step.
        """
        # this will raise errors in a normal-expected way
        encoded_o = super(PlotlyJSONEncoder, self).encode(o)
        # Brute force guessing whether NaN or Infinity values are in the string
        # We catch false positive cases (e.g. strings such as titles, labels etc.)
        # but this is ok since the intention is to skip the decoding / reencoding
        # step when it's completely safe

        if not ("NaN" in encoded_o or "Infinity" in encoded_o):
            return encoded_o

        # now:
        #    1. `loads` to switch Infinity, -Infinity, NaN to None
        #    2. `dumps` again so you get 'null' instead of extended JSON
        try:
            new_o = _json.loads(encoded_o, parse_constant=self.coerce_to_strict)
        except ValueError:

            # invalid separators will fail here. raise a helpful exception
            raise ValueError(
                "Encoding into strict JSON failed. Did you set the separators "
                "valid JSON separators?"
            )
        else:
            return _json.dumps(
                new_o,
                sort_keys=self.sort_keys,
                indent=self.indent,
                separators=(self.item_separator, self.key_separator),
            )

    def default(self, obj):
        """
        Accept an object (of unknown type) and try to encode with priority:
        1. builtin:     user-defined objects
        2. sage:        sage math cloud
        3. pandas:      dataframes/series
        4. numpy:       ndarrays
        5. datetime:    time/datetime objects
        Each method throws a NotEncoded exception if it fails.
        The default method will only get hit if the object is not a type that
        is naturally encoded by json:
            Normal objects:
                dict                object
                list, tuple         array
                str, unicode        string
                int, long, float    number
                True                true
                False               false
                None                null
            Extended objects:
                float('nan')        'NaN'
                float('infinity')   'Infinity'
                float('-infinity')  '-Infinity'
        Therefore, we only anticipate either unknown iterables or values here.
        """
        # TODO: The ordering if these methods is *very* important. Is this OK?
        encoding_methods = (
            self.encode_as_plotly,
            self.encode_as_numpy,
            self.encode_as_pandas,
            self.encode_as_datetime,
            self.encode_as_date,
            self.encode_as_list,  # because some values have `tolist` do last.
            self.encode_as_decimal,
        )
        for encoding_method in encoding_methods:
            try:
                return encoding_method(obj)
            except NotEncodable:
                pass
        return _json.JSONEncoder.default(self, obj)

    @staticmethod
    def encode_as_plotly(obj):
        """Attempt to use a builtin `to_plotly_json` method."""
        try:
            return obj.to_plotly_json()
        except AttributeError:
            raise NotEncodable

    @staticmethod
    def encode_as_list(obj):
        """Attempt to use `tolist` method to convert to normal Python list."""
        if hasattr(obj, "tolist"):
            return obj.tolist()
        else:
            raise NotEncodable

    @staticmethod
    def encode_as_pandas(obj):
        """Attempt to convert pandas.NaT"""
        if not pd:
            raise NotEncodable

        if obj is pd.NaT:
            return None
        else:
            raise NotEncodable

    @staticmethod
    def encode_as_numpy(obj):
        """Attempt to convert numpy.ma.core.masked"""
        if not np:
            raise NotEncodable

        if obj is np.ma.core.masked:
            return float("nan")
        elif isinstance(obj, np.ndarray) and obj.dtype.kind == "M":
            try:
                return np.datetime_as_string(obj).tolist()
            except TypeError:
                pass

        raise NotEncodable

    @staticmethod
    def encode_as_datetime(obj):
        """Convert datetime objects to iso-format strings"""
        try:
            return obj.isoformat()
        except AttributeError:
            raise NotEncodable

    @staticmethod
    def encode_as_date(obj):
        """Attempt to convert to utc-iso time string using date methods."""
        try:
            time_string = obj.isoformat()
        except AttributeError:
            raise NotEncodable
        else:
            return iso_to_plotly_time_string(time_string)

    @staticmethod
    def encode_as_decimal(obj):
        """Attempt to encode decimal by converting it to float"""
        if isinstance(obj, decimal.Decimal):
            return float(obj)
        else:
            raise NotEncodable


class NotEncodable(Exception):
    pass


def compare_values(first_value, second_value, operator):
    bool_ = None
    if operator == "<=":
        bool_ = first_value <= second_value
    elif operator == ">":
        bool_ = first_value > second_value
    elif operator == "<":
        bool_ = first_value < second_value
    elif operator == ">=":
        bool_ = first_value >= second_value
    elif operator == "!=":
        bool_ = first_value != second_value
    else:
        bool_ = first_value == second_value
    return bool_
