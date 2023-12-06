from scipy import fft
from flojoy import flojoy, DataFrame, Matrix, Image, Grayscale
from typing import Literal
from PIL import Image as PillowImage
import pandas as pd
import numpy as np


def extrapolate(x):
    return (x - x.min()) / (x.max() - x.min())


@flojoy
def TWO_DIMENSIONAL_FFT(
    default: Grayscale | DataFrame | Image | Matrix,
    real_signal: bool = True,
    color: Literal["red", "green", "blue", "grayscale"] = "red",
) -> Matrix | DataFrame | Image:
    """Performs a two-dimensional fast fourier transform on the input matrix.

    With the FFT algorithm, the input matrix will undergo a change of basis from the space domain into the frequency domain.

    grayscale, dataframe, image, or matrix

    Inputs
    ------
    default : Grayscale|DataFrame|Image|Matrix
        The 2D data to apply 2DFFT to.

    Parameters
    ----------
    real_signal : bool
        true if the input matrix consists of only real numbers, false otherwise
    color : select
        if the input is an RGBA or RGB image, this parameter selects the color channel to perform the FFT on

    Returns
    -------
    Matrix if input is Matrix
        m: the matrix after 2DFFT
    DataFrame if input is Dataframe
        m: the dataframe after 2DFFT
    Image
        the frequency spectrum of the color channel
    """

    match default:
        case Grayscale() | Matrix():
            input = default.m
            fourier = fft.rfft2(input) if real_signal else fft.fft2(input)
            if isinstance(default, Matrix):
                fourier = fourier.real
                return Matrix(m=fourier)
        case DataFrame():
            input: pd.DataFrame = pd.DataFrame(default.m)
            fourier = fft.rfft2(input) if real_signal else fft.fft2(input)
            fourier = fourier.real
            result = pd.DataFrame(columns=fourier.columns, index=fourier.index)
            return DataFrame(m=result)
        case Image():
            red = default.r
            green = default.g
            blue = default.b
            alpha = default.a
            if color == "grayscale":
                if alpha is None:
                    rgba_image = np.stack((red, green, blue), axis=2)
                else:
                    rgba_image = np.stack((red, green, blue, alpha), axis=2)
                try:
                    image = PillowImage.fromarray(rgba_image)
                except TypeError:
                    image = PillowImage.fromarray((rgba_image * 255).astype(np.uint8))
                image = image.convert("L")
                grayscale = np.array(image)
                fourier = fft.rfft2(grayscale) if real_signal else fft.fft2(grayscale)
            else:
                fourier = (
                    fft.rfft2(locals()[color], axes=[0, 1])
                    if real_signal
                    else fft.fft2(locals()[color], axes=[0, 1])
                )

    fourier = np.log10(np.abs(fourier))
    fourier = extrapolate(fourier)
    return Image(r=fourier, g=fourier, b=fourier, a=None)
