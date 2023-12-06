In this example, two image transformation were performed.

First the necessary blocks were added: `SKIMAGE` to fetch the example image, 3 `IMAGE` blocks to view the images, `ROTATE_IMAGE`, AND `IMAGE_SWIRL`.

The `degree` parameter for `ROTATE_IMAGE` controls the degrees of rotation and was set to 45, and the `radius` parameter of `IMAGE_SWIRL` was set to 750. The `SKLEARN` image was set to `camera`. The remaining parameters were left at default values

The blocks were connected as shown and the app was run.

Try changing the `mode` of the image rotation block and view the changes.
