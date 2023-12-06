In this example, the `SKIMAGE` node provides an astronaut image in RGB scale.

The image is then passed down to the `TWO_DIMENSIONAL_FFT` node where discrete fourier transform is applied across all pixels in the image. 
Note that since the image is in RGB, the DFT can only be applied to one color channel or the grayscale version of the original image. 
In this example, DFT is applied to the red channel.