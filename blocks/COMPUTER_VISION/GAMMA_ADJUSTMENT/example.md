In this example, contrast adjustments were performed on an example image.

First the necessary blocks were added: `SKIMAGE` to fetch the example image, 3 `IMAGE` blocks to view the images, `LOGARITHMIC_ADJUSTMENT`, AND `GAMMA_ADJUSTMENT`.

The `gamma` parameter for `GAMMA_ADJUSTMENT` was set to 1.5, and the `SKLEARN` image was set to `moon`. The remaining parameters were left at default values.

The blocks were connected as shown and the app was run.
