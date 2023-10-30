from PIL import Image as PILImage
import json
import requests
import pandas as pd
import numpy as np
from pydantic import validator, BaseModel
from typing import Optional, Generic, TypeVar

from flojoy import DataContainer
from flojoy.data_container import (
    OrderedPair,
    OrderedTriple,
    DataFrame,
    Matrix,
    Grayscale,
    Vector,
    Scalar,
    Image,
)
from flojoy.utils import PlotlyJSONEncoder


class NumpyEncoder(json.JSONEncoder):
    """json encoder for numpy types."""

    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        elif isinstance(obj, np.floating):
            return float(obj)
        elif isinstance(obj, np.ndarray):
            return obj.tolist()
        return json.JSONEncoder.default(self, obj)


DataC = TypeVar("DataC")


class DefaultModel(BaseModel, Generic[DataC]):
    ref: str
    dataContainer: dict
    workspaceId: str
    location: str
    note: str


class OrderedPairModel(DefaultModel[DataC], Generic[DataC]):
    data: Optional[DataC]

    @validator("dataContainer")
    def type_must_match(cls, dc):
        assert dc["type"] == "OrderedPair", "dataContainer type does not match."
        return dc

    @validator("dataContainer")
    def keys_must_match(cls, dc):
        assert "x" in dc, 'dataContainer does not contain "x" dataset.'
        assert "y" in dc, 'dataContainer does not contain "y" dataset.'
        assert isinstance(dc["x"], list), '"x" dataset is not a list'
        assert isinstance(dc["y"], list), '"y" dataset is not a list'
        return dc


class OrderedTripleModel(DefaultModel[DataC], Generic[DataC]):
    data: Optional[DataC]

    @validator("dataContainer")
    def type_must_match(cls, dc):
        assert dc["type"] == "OrderedTriple", "dataContainer type does not match."
        return dc

    @validator("dataContainer")
    def keys_must_match(cls, dc):
        assert "x" in dc, 'dataContainer does not contain "x" dataset.'
        assert "y" in dc, 'dataContainer does not contain "y" dataset.'
        assert "z" in dc, 'dataContainer does not contain "z" dataset.'
        assert isinstance(dc["x"], list), '"x" dataset is not a list'
        assert isinstance(dc["y"], list), '"y" dataset is not a list'
        assert isinstance(dc["z"], list), '"z" dataset is not a list'
        return dc


class DataFrameModel(DefaultModel[DataC], Generic[DataC]):
    data: Optional[DataC]

    @validator("dataContainer")
    def type_must_match(cls, dc):
        assert dc["type"] == "DataFrame", "dataContainer type does not match."
        return dc

    @validator("dataContainer")
    def keys_must_match(cls, dc):
        assert "m" in dc, 'dataContainer does not contain "m" dataset.'
        assert isinstance(
            dc["m"], dict
        ), f'"m" dataset is not a list, type: {type(dc["m"])}'
        return dc


class MatrixModel(DefaultModel[DataC], Generic[DataC]):
    data: Optional[DataC]

    @validator("dataContainer")
    def type_must_match(cls, dc):
        assert dc["type"] == "Matrix", "dataContainer type does not match."
        return dc

    @validator("dataContainer")
    def keys_must_match(cls, dc):
        assert "m" in dc, 'dataContainer does not contain "m" dataset.'
        assert isinstance(dc["m"], list), '"m" dataset is not a list'
        assert isinstance(dc["m"][0], list), '"m" dataset is not a matrix'
        assert not isinstance(dc["m"][0][0], list), '"m" dataset is not 2D'
        return dc


class GrayscaleModel(DefaultModel[DataC], Generic[DataC]):
    data: Optional[DataC]

    @validator("dataContainer")
    def type_must_match(cls, dc):
        assert dc["type"] == "Grayscale", "dataContainer type does not match."
        return dc

    @validator("dataContainer")
    def keys_must_match(cls, dc):
        assert "m" in dc, 'dataContainer does not contain "m" dataset.'
        assert isinstance(dc["m"], list), '"m" dataset is not a list'
        assert isinstance(dc["m"][0], list), '"m" dataset is not a matrix'
        assert not isinstance(dc["m"][0][0], list), '"m" dataset is not 2D'
        return dc


class ScalarModel(DefaultModel[DataC], Generic[DataC]):
    data: Optional[DataC]

    @validator("dataContainer")
    def type_must_match(cls, dc):
        assert dc["type"] == "Scalar", "dataContainer type does not match."
        return dc

    @validator("dataContainer")
    def keys_must_match(cls, dc):
        assert "c" in dc, 'dataContainer does not contain "c" dataset.'
        assert isinstance(dc["c"], float) or isinstance(
            dc["c"], int
        ), '"c" dataset is not a float or int'
        return dc


class VectorModel(DefaultModel[DataC], Generic[DataC]):
    data: Optional[DataC]

    @validator("dataContainer")
    def type_must_match(cls, dc):
        assert dc["type"] == "Vector", "dataContainer type does not match."
        return dc

    @validator("dataContainer")
    def keys_must_match(cls, dc):
        assert "v" in dc, 'dataContainer does not contain "v" dataset.'
        assert isinstance(dc["v"], list)
        return dc


class ImageModel(DefaultModel[DataC], Generic[DataC]):
    data: Optional[DataC]

    @validator("dataContainer")
    def type_must_match(cls, dc):
        assert dc["type"] == "Image", "dataContainer type does not match."
        return dc

    @validator("dataContainer")
    def keys_must_match(cls, dc):
        assert "r" in dc, 'dataContainer does not contain "r" dataset.'
        assert "g" in dc, 'dataContainer does not contain "g" dataset.'
        assert "b" in dc, 'dataContainer does not contain "b" dataset.'
        assert isinstance(dc["r"], list), '"r" dataset is not a list'
        assert isinstance(dc["g"], list), '"g" dataset is not a list'
        assert isinstance(dc["b"], list), '"b" dataset is not a list'
        return dc


def check_deserialize(response):
    dc_type = response["dataContainer"]["type"]
    match dc_type:
        case "OrderedPair":
            OrderedPairModel.parse_obj(response)
        case "OrderedTriple":
            OrderedTripleModel.parse_obj(response)
        case "DataFrame":
            DataFrameModel.parse_obj(response)
        case "Matrix":
            MatrixModel.parse_obj(response)
        case "Grayscale":
            GrayscaleModel.parse_obj(response)
        case "Scalar":
            ScalarModel.parse_obj(response)
        case "Vector":
            VectorModel.parse_obj(response)
        case "Image":
            ImageModel.parse_obj(response)
        case _:
            raise TypeError(
                f"Unsupported DataContainer type: {dc_type}. Check case (e.g. OrderedPair)."
            )


class FlojoyCloud:
    """
    A class that allows pulling and pushing DataContainers from the
    Flojoy cloud client (cloud.flojoy.ai).

    Returns data in a pythonic format (e.g. Pillow for images,
    DataFrames for arrays/matrices).

    Will support the majority of the Flojoy cloud API:
    https://rest.flojoy.ai/api-reference

    Recommended for api key:
    utils.get_credentials()[0]["value"]
    or
    os.environ.get("FLOJOY_CLOUD_KEY")
    """

    def __init__(self, api_key: str):
        self.headers = {"api_key": api_key}
        self.base_url = "https://cloud.flojoy.ai/api/v1"
        self.valid_types = [
            "OrderedPair",
            "OrderedTriple",
            "DataFrame",
            "Grayscale",
            "Matrix",
            "Scalar",
            "Vector",
            "Image",
        ]

    def _create_payload(self, data, dc_type: str) -> str:
        """
        A method that formats data into a payload that can be handled by
        the Flojoy cloud client.
        """
        if isinstance(data, DataContainer):
            return json.dumps({"data": data}, cls=PlotlyJSONEncoder)

        assert (
            dc_type in self.valid_types
        ), f"Type {dc_type} not supported. Check capitals (e.g. OrderedPair)."
        match dc_type:
            case "OrderedPair":
                if not (isinstance(data, dict) and "x" in data and "y" in data):
                    raise TypeError(
                        "For ordered pair type, data must be in dictionary form with keys 'x' and 'y'"
                    )
                payload = json.dumps(
                    {
                        "data": {
                            "type": "OrderedPair",
                            "x": data["x"],
                            "y": data["y"],
                        }
                    },
                    cls=NumpyEncoder,
                )
        match dc_type:
            case "OrderedTriple":
                if isinstance(data, dict) and "x" in data:
                    payload = json.dumps(
                        {
                            "data": {
                                "type": "OrderedTriple",
                                "x": data["x"],
                                "y": data["y"],
                                "z": data["z"],
                            }
                        },
                        cls=NumpyEncoder,
                    )
                else:
                    print(
                        "For ordered triple type, data must be in"
                        " dictionary form with keys 'x', 'y', and 'z'"
                    )
                    raise TypeError
            case "DataFrame":
                payload = json.dumps(
                    {"data": {"type": "DataFrame", "m": data}}, cls=PlotlyJSONEncoder
                )
            case "Matrix":
                payload = json.dumps(
                    {"data": {"type": "Matrix", "m": data}}, cls=NumpyEncoder
                )
            case "Grayscale":
                payload = json.dumps(
                    {"data": {"type": "Grayscale", "m": data}}, cls=NumpyEncoder
                )
            case "Scalar":
                payload = json.dumps(
                    {"data": {"type": "Scalar", "c": data}}, cls=NumpyEncoder
                )
            case "Vector":
                payload = json.dumps(
                    {"data": {"type": "Vector", "v": data}}, cls=NumpyEncoder
                )
            case "Image":
                RGB_img = np.asarray(data)
                red_channel = RGB_img[:, :, 0]
                green_channel = RGB_img[:, :, 1]
                blue_channel = RGB_img[:, :, 2]

                if RGB_img.shape[2] == 4:
                    alpha_channel = RGB_img[:, :, 3]
                else:
                    alpha_channel = None
                payload = json.dumps(
                    {
                        "data": {
                            "type": "Image",
                            "r": red_channel,
                            "g": green_channel,
                            "b": blue_channel,
                            "a": alpha_channel,
                        }
                    },
                    cls=NumpyEncoder,
                )

        return payload

    def fetch_dc(self, dc_id: str) -> dict:
        """
        A method that retrieves DataContainers from the Flojoy cloud.
        """
        url = f"{self.base_url}/dcs/{dc_id}"
        response = requests.request("GET", url, headers=self.headers)
        response = json.loads(response.text)
        check_deserialize(response)
        return response

    def to_python(self, dc: dict) -> pd.DataFrame | float | list | PILImage.Image:
        """
        A method that converts data from DataContainers into pythonic
        data types like Pillow for images.
        """
        dc_type = dc["dataContainer"]["type"]
        match dc_type:
            case "OrderedPair" | "OrderedTriple":
                df = pd.DataFrame(dc["dataContainer"])
                return df.drop(columns=["type"])
            case "DataFrame" | "Matrix" | "Grayscale":
                df = pd.DataFrame(dc["dataContainer"]["m"])
                return df
            case "Scalar":
                return float(dc["dataContainer"]["c"])
            case "Vector":
                return list(dc["dataContainer"]["v"])
            case "Image":
                image = dc["dataContainer"]
                r = image["r"]
                g = image["g"]
                b = image["b"]
                if "a" in image:
                    a = image["a"]
                    img_combined = np.stack((r, g, b, a), axis=2)
                    return PILImage.fromarray(np.uint8(img_combined)).convert("RGBA")
                else:
                    img_combined = np.stack((r, g, b), axis=2)
                    return PILImage.fromarray(np.uint8(img_combined)).convert("RGB")

    def to_dc(self, dc: dict) -> DataContainer:
        """
        A method that converts data from DataContainers into pythonic
        data types like Pillow for images.
        """
        dc = dc["dataContainer"]
        match dc["type"]:
            case "OrderedPair":
                return OrderedPair(x=np.array(dc["x"]), y=np.array(dc["y"]))
            case "OrderedTriple":
                return OrderedTriple(
                    x=np.array(dc["x"]), y=np.array(dc["y"]), z=np.array(dc["z"])
                )
            case "DataFrame":
                return DataFrame(df=pd.DataFrame(dc["m"]))
            case "Matrix":
                return Matrix(m=np.array(dc["m"]))
            case "Grayscale":
                return Grayscale(img=np.array(dc["m"]))
            case "Scalar":
                return Scalar(c=float(dc["c"]))
            case "Vector":
                return Vector(v=np.array(dc["v"]))
            case "Image":
                r = np.array(dc["r"], dtype=np.uint8)
                g = np.array(dc["g"], dtype=np.uint8)
                b = np.array(dc["b"], dtype=np.uint8)
                if "a" in dc:
                    a = np.array(dc["a"], dtype=np.uint8)
                    return Image(r=r, g=g, b=b, a=a)
                else:
                    return Image(r=r, g=g, b=b)
            case _:
                raise Exception("Unknown data container type")

    def create_measurement(self, name: str, privacy: str = "private") -> dict:
        """
        A method that creates a measurements with the name specified.
        """
        url = f"{self.base_url}/measurements"
        payload = json.dumps({"name": name, "privacy": privacy})
        response = requests.request("POST", url, headers=self.headers, data=payload)
        response = json.loads(response.text)

        return response

    def list_measurements(self, size: int = 10) -> list:
        """
        A method that lists the number of measurements specified.

        If the number of measurements is less than the specified number,
        an error will be thrown.
        """
        url = f"{self.base_url}/measurements/?size={size}"
        response = requests.request("GET", url, headers=self.headers)
        response = json.loads(response.text)
        response = response["data"]

        return response

    def fetch_measurement(self, meas_id: str):
        """
        A method fetchs measurements from the client.
        """
        url = f"{self.base_url}/measurements/{meas_id}"
        response = requests.request("GET", url, headers=self.headers)
        response = json.loads(response.text)

        return response

    def rename_measurement(self, meas_id: str, name: str):
        """
        Rename the specified measurement.
        """
        url = f"{self.base_url}/measurements/{meas_id}"
        payload = payload = json.dumps({"name": name})
        response = requests.request("PATCH", url, headers=self.headers, data=payload)
        response = json.loads(response.text)

        return response

    def store_dc(self, data, dc_type: str, meas_id: str):
        """
        A method that stores a formatted data payload in a measurement.
        """
        url = f"{self.base_url}/dcs/add/{meas_id}"
        payload = self._create_payload(data, dc_type)
        response = requests.request("POST", url, headers=self.headers, data=payload)

        return json.loads(response.text)
