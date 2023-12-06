from itertools import combinations
from math import floor
from os import cpu_count
from typing import Literal, Optional, TypedDict
from warnings import catch_warnings, simplefilter

import numpy as np
import plotly.express as px
import plotly.graph_objects as go
import scipy.fft
import skimage.filters as filters
from flojoy import DCNpArrayType, Grayscale, Image, Matrix, Plotly, flojoy
from blocks.DATA.VISUALIZATION.template import plot_layout
from PIL import Image as PILImage
from scipy import spatial
from scipy.fft import _pocketfft
from scipy.ndimage import gaussian_filter, laplace, shift
from scipy.signal import fftconvolve
from skimage.draw import ellipse
from skimage.measure import label, regionprops
from skimage.morphology import binary_erosion, disk
from skimage.registration import phase_cross_correlation
from skimage.registration._masked_phase_cross_correlation import cross_correlate_masked


class EXTREMA_OUTPUT(TypedDict):
    fig: Plotly
    blobs: Grayscale


@flojoy(deps={"scikit-image": "0.21.0"}, node_type="VISUALIZERS")
def EXTREMA_DETERMINATION(
    default: Image | Grayscale | Matrix,
    image_mask: Optional[Grayscale | Matrix] = None,
    center: Optional[list[int]] = None,
    min_dist: float = 0.0,
    algorithm: Literal["persistence", "high_symmetry", "log"] = "log",
    prominence: float = 0.0,
    k: float = 1.41,
    sigma: float = 1.0,
    max_power: int = 9,
) -> EXTREMA_OUTPUT:
    r"""Determine the peak in an image.

    The ability to find local peaks will not depend on the extrema being
    exponentially separated from the neighboring values, or some other restrictive constraint.

    We implement three algorithms to find the local max. The first algorithm uses a masked phase
    cross correlation technique [1], while the second uses the persistence birth/death algorithms [2, 3].
    The original implementations of these libraries were utilized for the detection of elastic
    scattering peaks in diffraction data, found in the 'scikit-ued' library of Python [4].

    Note that the algorithm assumes that the extrema are symmetrically distributed around
    a center point. All extrema are determined relative to the center position.
    Also, for closely spaced points, noisy data, or data that has a very high dynamic range, the
    algorithm fails. Therefore, this approach is suited only for images with
    high degrees of symmetry and reasonable contrast.

    Therefore, we also use the second prominence algorithm, where a single
    value is applied locally to determine the relative 'peakiness' of a given pixel,
    inspecting only the neighbors around that given pixel. While computationally
    more intense for images with a resolution of >4K, it produces extremely accurate
    results for the correct value of prominence in potentially low-contrast images.
    By definition, it is a local pixel algorithm, and therefore does not perform any blob detection,
    unlike the high-symmetry algorithm which creates high contrast in
    the image with laplacian filtering, and identifies regions of this high contrast image.

    Note, however, that the persistence algorithm tends to find more points than what are actually there.
    For images with high frequency components (i.e. quickly varying values among the third nearest neighbours),
    the algorithm will tend to identify each as a 'peak', even though the local maxima is elsewhere. This
    therefore assumes that the image has been properly preprocessed with another image processing node to
    provide a sufficient low-frequency image such that the prominence of each pixel is well defined.

    To combat this limitation, we present the most robust of the algorithms that should work on images
    of low or high contrast, low or high frequency components, and of low or high dynamic range. It is
    computationally more expensive, as it involves repeated convolutions of the image, but it is
    the most reliable of the methods for a general image.

    This routine is known as the Laplacian of Gaussian algorithm [5].
    The key to this algorithm is to apply a filter specially chosen such that regions around peaks have high
    levels of contrast (essentially binarize the image around its peak so that near the peak, the
    image is one, and zero otherwise). To achieve such a filter, the Laplacian of a Gaussian is used:

    .. math:: \nabla^2 L \equiv L_{xx} + L_{yy}

    which yields the following filter (for a Gaussian of width sigma, centered at the origin):

    ..math :: LG = -\frac{1}{\pi\sigma^4}\big[1-\frac{x^2+y^2}{2\sigma^2}\big]e^{-\frac{x^2+y^2}{2\sigma^2}}

    The output of this filter will be a maximum where there is an edge from a peak, the maximum response
    of which is given for 1.41*'blob radius' around the peak.
    Applying this filter repeatedly with varying degrees of sigma, will continue to refine the edges around
    the peak until the image is essentially binarized around the peaks. Due to the repeated convolutions,
    this algorithm is generally expensive, but specific methods have been implemented using FFT to speed
    up these calculations.


    Parameters
    ----------
    default : Image | Grayscale | Matrix
        The input DataContainer that contains the image to be processed.
        Can either be RGBA, greyscale, or a matrix type.
        In the case of RGB(A), the image is flattened to grayscale for the peak detection.
    image_mask : Grayscale | Matrix
        This object provides a mask to apply to the peak finding routines.
        Peaks found by any algorithm inside this mask are ignored.
        Should be of a datatype that can be static cast to booleans.
        If none, it is assumed that the entire image is valid for peak detection.
    center : list[int]
        For the high symmetry algorithm, this provides the center of symmetry
        to pass to the cross correlation routines.
        If none is provided, an autocenter routine is run to attempt to find the center of symmetry.
    min_dist : float
        The minimum distance between peaks.
        If the L2 distance (in pixels) of any pair of peaks is less than min_dist,
        they are considered to be the same, and one is discarded.
        This parameter applies to all algorithms.
    algorithm : str
        The name of the algorithm to use.
    prominence : float
        In the prominence and Laplacian of Gaussian algorithms, this defines the threshold
        above or below which objects must pass in order to be considered a peak.
        Does not apply to the high_symmetry algorithm.
    k : float
        This specifies the scaling of Gaussian filters between successive applications
        of Gaussian filters of increasing sigma.
        Default is chosen for ideal spherically symmetric peaks.
        Can be tuned for more bizarre looking peak structures.
        Applies only to the Laplacian of Gaussian algorithm.
    sigma : float
        The baseline standard deviation of the Gaussian filters,
        only for the Laplacian of Gaussian algorithm.
    max_power : int
        Describes the upper limit of the degree of exponentiation for the successive
        application of filters, only in the Laplacian of Gaussian algorithm.

    Returns
    -------
    fig : Plotly
        The Plotly figure so that the image can be visualized with its found peaks.
    blobs : Grayscale
        A blob mask that returns the regions around the found peaks.
        It is only valid for the high_symmetry and log routines.
        As the persistence algorithm is by definition hyperlocal, it has no notion of blobs
        throughout the detection process, and as such returns a unity mask.

    References
    ----------
    [1] Liu, Lai Chung. Chemistry in Action: Making Molecular Movies with Ultrafast
    Electron Diffraction and Data Science, Chapter 2. Springer Nature, 2020.

    [2] Huber, S. (2021). Persistent Homology in Data Science. In: Haber, P.,
    Lampoltshammer, T., Mayr, M., Plankensteiner, K. (eds) Data Science - Analytics
    and Applications. Springer Vieweg, Wiesbaden.
    https://doi.org/10.1007/978-3-658-32182-6_13

    [3] Edelsbrunner, H. and John L Harer (2010). Computational Topology. In: American
    Mathematical Society.

    [4] L. P. René de Cotret, M. R. Otto, M. J. Stern. and B. J. Siwick.
    An open-source software ecosystem for the interactive exploration of
    ultrafast electron scattering data, Advanced Structural and Chemical
    Imaging 4:11 (2018)

    [5] https://en.wikipedia.org/wiki/Blob_detection#The_Laplacian_of_Gaussian
    """

    if isinstance(default, Image):
        r = default.r
        g = default.g
        b = default.b
        a = default.a

        if a is None:
            image = np.stack((r, g, b), axis=2)
        else:
            image = np.stack((r, g, b, a), axis=2)
        image = PILImage.fromarray(image)
        image = np.array(
            image.convert("L"), dtype=np.uint8
        )  # a greyscale image that can be processed
    elif isinstance(default, Grayscale) or isinstance(default, Matrix):
        image = np.array(default.m)  # explicit typing just to be extra safe

    # This now produces an (M, N) array that we can then process! The algorithms
    # have no specificity on input data type unlike the `REGION_PROPERTIES` node.
    if image_mask is None:
        mask = np.ones(image.shape)
    else:
        mask = image_mask.m
        if mask.shape != image.shape:
            raise IndexError("Provided mask is not the same shape as the input image.")
    blob_mask = np.zeros(image.shape, dtype=np.uint8)
    match algorithm:
        case "high_symmetry":
            if center is None:
                center = autocenter(im=image, mask=mask)
                # Then we need to autodetermine the center of the image
                # raise ValueError("For the crossed correlated mask algorithm, the center of the peaks \
                #                   in the image must be specified")
            im = np.array(image, copy=True, dtype=float)
            im -= im.min()

            with catch_warnings():
                simplefilter("ignore", category=RuntimeWarning)
                im /= gaussian_filter(input=im, sigma=min(image.shape) / 20, truncate=2)
            im = np.nan_to_num(im, copy=False)

            autocorr = np.abs(
                cross_correlate_masked(arr1=im, arr2=im, m1=mask, m2=mask, mode="same")
            )
            autocorr = shift(
                autocorr,
                shift=np.asarray(center) - np.array(im.shape) / 2,
                order=1,
                mode="nearest",
            )
            laplacian = -1 * laplace(autocorr)
            threshold = filters.threshold_triangle(laplacian)
            regions = (laplacian > threshold) * mask

            # To prevent noise from looking like actual peaks,
            # we erode labels using a small selection area
            regions = binary_erosion(regions, footprint=disk(2))

            labels = label(regions, return_num=False)
            props = regionprops(label_image=labels, intensity_image=im)
            candidates = [
                prop for prop in props if not np.any(np.isnan(prop.weighted_centroid))
            ]
            peaks = list()
            for prop in candidates:
                pos = np.asarray(prop.weighted_centroid)
                if any((np.linalg.norm(peak - pos) < min_dist) for peak in peaks):
                    continue
                else:
                    if prop.area_convex < 0.2 * np.prod(image.shape):
                        for coord in prop.coords:
                            blob_mask[coord[0], coord[1]] = 1
                    peaks.append(pos[::-1])
            peaks = np.array([peaks]).reshape(
                -1, 2
            )  # now gives us the final array of peaks
        case "persistence":  # we use the persistence algorithm
            g0 = Persistence(image).persistence
            birth_death = list()
            birth_death_indices = list()
            persistencies = list()
            candidates = list()
            bd_threshold = 0.0
            for i, homclass in enumerate(g0):
                p_birth, bl, pers, p_death = homclass
                persistencies.append(pers)
                if pers <= bd_threshold:
                    continue
                x, y = bl, bl - pers
                birth_death.append([x, y])
                birth_death_indices.append(i)
            for i, homclass in enumerate(g0):
                p_birth, bl, pers, p_death = homclass
                if pers <= prominence:
                    continue
                y, x = p_birth
                candidates.append([x, y])
            if min_dist > 0.0:
                combos = combinations(candidates, 2)
                points_to_remove = [
                    point2
                    for point1, point2 in combos
                    if np.linalg.norm(np.array(point1) - np.array(point2)) < min_dist
                ]
                candidates = [
                    point for point in candidates if point not in points_to_remove
                ]
            peaks = np.array(candidates).reshape(-1, 2)
            # remove peaks that are within the masked area
            if mask.sum() != mask.shape[0] * mask.shape[1]:
                peaks = np.array([p for p in candidates if mask[p[1], p[0]]]).reshape(
                    -1, 2
                )

        case "log":
            # This is the most expensive algorithm!!
            # Use only when dire!

            # Step 1: we need to define the lapacian of a gaussian for a given sigma
            def laplacian_of_gaussian(
                sigma: float,
            ):  # first define the laplacian of a gaussian filter
                # window size
                n = np.ceil(sigma * 6)
                y, x = np.ogrid[-n // 2 : n // 2 + 1, -n // 2 : n // 2 + 1]
                y_filter = np.exp(-(y**2 / (2.0 * sigma * sigma)))
                x_filter = np.exp(-(x**2 / (2.0 * sigma * sigma)))
                return (
                    (-(2 * sigma**2) + (x * x + y * y))
                    * (x_filter * y_filter)
                    * (1 / (2 * np.pi * sigma**4))
                )

            # Step 2: perform the convolution with the LOG filters for increasing powers of sigma
            log_images = np.zeros((max_power, *image.shape))  # to store responses
            with scipy.fft.set_backend(customFFTBackend):
                for i in range(max_power):
                    log_images[i, ...] = np.square(
                        fftconvolve(
                            image,
                            laplacian_of_gaussian(sigma * np.power(k, i)),
                            mode="same",
                        )
                    )  # squaring the response
            # Step 3: detect the blobs
            peaks_with_radius = list()
            (h, w) = image.shape
            for i in range(1, h):
                for j in range(1, w):
                    slice_img = log_images[:, i - 1 : i + 2, j - 1 : j + 2]
                    result = np.amax(slice_img)
                    # result_1 = np.amin(slice_img)
                    if result >= prominence:
                        z, x, y = np.unravel_index(slice_img.argmax(), slice_img.shape)
                        peaks_with_radius.append((i + x - 1, j + y - 1, k**z * sigma))
            candidates = np.array(list(set(peaks_with_radius)))
            if min_dist > 0.0:
                sigma = candidates[:, -1].max()
                distance = 2 * sigma * np.sqrt(candidates.shape[1] - 1)
                tree = spatial.cKDTree(candidates[:, :-1])
                pairs = np.array(list(tree.query_pairs(distance)))
                if len(pairs) == 0:
                    return candidates
                else:
                    for i, j in pairs:
                        blob1, blob2 = candidates[i], candidates[j]
                        if np.linalg.norm(blob1[:-1] - np.array(blob2[:-1])) < min_dist:
                            if blob1[-1] > blob2[-1]:
                                blob2[-1] = 0
                            else:
                                blob1[-1] = 0
                candidates = np.array([b for b in candidates if b[-1] > 0])
            # Step 4: This method needs to be robust under the situation of contrast issues
            # To get around this, we now pass these blobs to the standard blob detection
            # algorithms to get the centroid of each contour now that we've identified
            # regions of interest
            for blob in candidates:
                y, x, r = blob
                rr, cc = ellipse(x, y, r / 2, r / 2, shape=blob_mask.shape)
                blob_mask[rr, cc] = 1
            labels = label(blob_mask)
            rprops = regionprops(label_image=labels, intensity_image=blob_mask)
            peaks = list()
            for region in [
                prop for prop in rprops if not np.any(np.isnan(prop.weighted_centroid))
            ]:
                peaks.append(region.weighted_centroid)
            peaks = np.array(peaks).reshape(-1, 2)
    # Congratulations! We now have an (N,2) array of the peaks in the image;
    # let's visualize it!
    # Right now we have a greyscale image, let's create a version
    # that's black and white so we can render it. First, scale image to
    # range 0-255.

    rgb_image = np.zeros(
        (*image.shape, 3), dtype=np.uint8
    )  # only generated for plotting
    rgb_image[..., 0] = image * 255  # Red channel
    rgb_image[..., 1] = image * 255  # Green channel
    rgb_image[..., 2] = image * 255  # Blue channel

    layout = plot_layout(title=f"IMAGE with {peaks.shape[0]} objects")
    fig = px.imshow(img=rgb_image)
    fig.layout = layout
    marker_trace = go.Scatter(
        x=peaks[:, 0],
        y=peaks[:, 1],
        mode="markers",
        marker=dict(color="green", size=15),
        showlegend=False,
    )
    fig.add_trace(marker_trace)

    fig.update_xaxes(range=[image.shape[0], 0])
    fig.update_yaxes(range=[image.shape[1], 0])
    return EXTREMA_OUTPUT(fig=Plotly(fig=fig), blobs=Grayscale(img=blob_mask))


class UnionFind:
    """Union-find data structure.

    Each unionFind instance X maintains a family of disjoint sets of
    hashable objects, supporting the following two methods:

    - X[item] returns a name for the set containing the given item.
      Each set is named by an arbitrarily-chosen one of its members; as
      long as the set remains unchanged it will keep the same name. If
      the item is not yet part of a set in X, a new singleton set is
      created for it.

    - X.union(item1, item2, ...) merges the sets containing each item
      into a single larger set.  If any item is not yet part of a set
      in X, it is added to X as one of the members of the merged set.
    """

    def __init__(self):
        """Create a new empty union-find structure."""
        self.weights = {}
        self.parents = {}

    def add(self, object, weight):
        if object not in self.parents:
            self.parents[object] = object
            self.weights[object] = weight

    def __contains__(self, object):
        return object in self.parents

    def __getitem__(self, object):
        """Find and return the name of the set containing the object."""

        # check for previously unknown object
        if object not in self.parents:
            assert False
            self.parents[object] = object
            self.weights[object] = 1
            return object

        # find path of objects leading to the root
        path = [object]
        root = self.parents[object]
        while root != path[-1]:
            path.append(root)
            root = self.parents[root]

        # compress the path and return
        for ancestor in path:
            self.parents[ancestor] = root
        return root

    def __iter__(self):
        """Iterate through all items ever found or unioned by this structure."""
        return iter(self.parents)

    def union(self, *objects):
        """Find the sets containing the objects and merge them all."""
        roots = [self[x] for x in objects]
        heaviest = max([(self.weights[r], r) for r in roots])[1]
        for r in roots:
            if r != heaviest:
                self.parents[r] = heaviest


class Persistence:
    def __init__(self, im):
        self.image = im
        self.calculate()

    def calculate(self):
        h, w = self.image.shape

        # Get indices ordered by value from high to low
        indices = [(i, j) for i in range(h) for j in range(w)]
        indices.sort(key=lambda p: self.get(p), reverse=True)

        # Maintains the growing sets
        self.uf = UnionFind()

        self._groups0 = {}

        # Process pixels from high to low
        for i, p in enumerate(indices):
            v = self.get(p)
            ni = [self.uf[q] for q in self.iter_neighbors(p, w, h) if q in self.uf]
            nc = sorted([(self.get_comp_birth(q), q) for q in set(ni)], reverse=True)

            if i == 0:
                self._groups0[p] = (v, v, None)

            self.uf.add(p, -i)

            if len(nc) > 0:
                oldp = nc[0][1]
                self.uf.union(oldp, p)

                # Merge all others with oldp
                for bl, q in nc[1:]:
                    if self.uf[q] not in self._groups0:
                        # print(i, ": Merge", uf[q], "with", oldp, "via", p)
                        self._groups0[self.uf[q]] = (bl, bl - v, p)
                    self.uf.union(oldp, q)

        self._groups0 = [
            (k, self._groups0[k][0], self._groups0[k][1], self._groups0[k][2])
            for k in self._groups0
        ]
        self._groups0.sort(key=lambda g: g[2], reverse=True)
        self.persistence = self._groups0

    def get_comp_birth(self, p):
        return self.get(self.uf[p])

    def get(self, p):
        return self.image[p[0]][p[1]]

    def iter_neighbors(self, p, w, h):
        y, x = p

        # 8-neighborship
        neigh = [(y + j, x + i) for i in [-1, 0, 1] for j in [-1, 0, 1]]
        # 4-neighborship
        # neigh = [(y-1, x), (y+1, x), (y, x-1), (y, x+1)]

        for j, i in neigh:
            if j < 0 or j >= h:
                continue
            if i < 0 or i >= w:
                continue
            if j == y and i == x:
                continue
            yield j, i


class customFFTBackend:
    """
    Pocket fft is usually a lot faster for this type of registration.
    This class simply provides the implementation of the uarray protocol
    to the scipy context manager.
    """

    __ua_domain__ = "numpy.scipy.fft"

    @staticmethod
    def __ua_function__(method, args, kwargs):
        fn = getattr(_pocketfft, method.__name__, None)

        if fn is None:
            return NotImplemented
        workers = kwargs.pop("workers", cpu_count())
        return fn(*args, workers=workers, **kwargs)


def autocenter(im: DCNpArrayType, mask: Optional[DCNpArrayType] = None):
    im = np.array(im, copy=True, dtype=float)
    im -= im.min()
    if mask is None:
        mask = np.ones_like(im, dtype=bool)
        weights = im
    else:
        weights = im * mask.astype(im.dtype)
    rr, cc = np.indices(im.shape)
    r_ = int(np.average(rr, weights=weights))
    c_ = int(np.average(cc, weights=weights))
    # Determine the smallest center -> side distance, and crop around that
    # 1. Some images are not centered, and so there's a lot
    # of image area that cannot be used for registration.
    # 2. radial inversion becomes simple inversion of dimensions
    side_length = floor(min([r_, abs(r_ - im.shape[0]), c_, abs(c_ - im.shape[1])]))
    rs = slice(r_ - side_length, r_ + side_length)
    cs = slice(c_ - side_length, c_ + side_length)
    im = im[rs, cs]
    mask = mask[rs, cs]

    # Certain images display a gradient in the overall intensity
    # For this purpose, we normalize the intensity by some "background",
    # i.e. very blurred diffraction pattern
    with catch_warnings():
        simplefilter("ignore", category=RuntimeWarning)
        im /= gaussian_filter(input=im, sigma=min(im.shape) / 25, truncate=2)
    im = np.nan_to_num(im, copy=False)

    # The comparison between Friedel pairs from [1] is generalized to
    # any inversion symmetry.
    im_i = im[::-1, ::-1]
    mask_i = mask[::-1, ::-1]

    # masked normalized cross-correlation is extremely expensive
    # we therefore downsample large images for essentially identical result
    # but ~4x decrease in processing time
    downsampling = 1
    if min(im.shape) > 1024:
        downsampling = 2

    with scipy.fft.set_backend(customFFTBackend):
        shift, *_ = phase_cross_correlation(
            reference_image=im[::downsampling, ::downsampling],
            moving_image=im_i[::downsampling, ::downsampling],
            reference_mask=mask[::downsampling, ::downsampling],
            moving_mask=mask_i[::downsampling, ::downsampling],
            return_error="always",
        )
    # Because images were downsampled, the correction
    # factor to the rough center should be increased from the measured shift
    correction = shift * downsampling

    return np.array([r_, c_]) + correction / 2
