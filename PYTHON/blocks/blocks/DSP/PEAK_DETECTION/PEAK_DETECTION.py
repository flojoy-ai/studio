from scipy.signal import find_peaks
from flojoy import flojoy, OrderedPair


@flojoy
def PEAK_DETECTION(
    default: OrderedPair,
    height: str = None,
    threshold: str = None,
    distance: str = None,
    prominence: str = None,
    width: str = None,
    wlen: str = None,
    rel_height: str = None,
    plateau_size: str = None,
) -> OrderedPair:
    """The PEAK_DETECTION block finds peaks based on peak properties.

    Inputs
    ------
    default : OrderedPair
        The data to find peaks in.

    Parameters
    ----------
    height : float, optional
        Required height of peaks. Either a number, ``None``, an array matching
        `x` or a 2-element sequence of the former. The first element is
        always interpreted as the  minimal and the second, if supplied, as the
        maximal required height.
    threshold : float, optional
        Required threshold of peaks, the vertical distance to its neighboring
        samples. Either a number, ``None``, an array matching `x` or a
        2-element sequence of the former. The first element is always
        interpreted as the  minimal and the second, if supplied, as the maximal
        required threshold.
    distance : float, optional
        Required minimal horizontal distance (>= 1) in samples between
        neighbouring peaks. Smaller peaks are removed first until the condition
        is fulfilled for all remaining peaks.
    prominence : float, optional
        Required prominence of peaks. Either a number, ``None``, an array
        matching `x` or a 2-element sequence of the former. The first
        element is always interpreted as the  minimal and the second, if
        supplied, as the maximal required prominence.
    width : float, optional
        Required width of peaks in samples. Either a number, ``None``, an array
        matching `x` or a 2-element sequence of the former. The first
        element is always interpreted as the  minimal and the second, if
        supplied, as the maximal required width.
    wlen : int, optional
        Used for calculation of the peaks prominences, thus it is only used if
        one of the arguments `prominence` or `width` is given. See argument
        `wlen` in `peak_prominences` for a full description of its effects.
    rel_height : float, optional
        Used for calculation of the peaks width, thus it is only used if `width`
        is given. See argument  `rel_height` in `peak_widths` for a full
        description of its effects.
    plateau_size : float, optional
        Required size of the flat top of peaks in samples. Either a number,
        ``None``, an array matching `x` or a 2-element sequence of the former.
        The first element is always interpreted as the minimal and the second,
        if supplied as the maximal required plateau size.

    Returns
    -------
    OrderedPair
        x: x axis location for peaks
        y: peaks
    """

    height = float(height) if height != "" else None
    if threshold == "":
        threshold = None
    else:
        threshold = float(threshold)
    if distance == "":
        distance = None
    else:
        distance = float(distance)
    if prominence == "":
        prominence = None
    else:
        prominence = float(prominence)
    if width == "":
        width = None
    else:
        width = float(width)
    if wlen == "":
        wlen = None
    else:
        wlen = int(wlen)
    if rel_height == "":
        rel_height = None
    else:
        rel_height = float(rel_height)
    if plateau_size == "":
        plateau_size = None
    else:
        plateau_size = float(plateau_size)

    print(type(height), type(plateau_size), flush=True)

    signal = default.y
    print(default)
    peaks, _ = find_peaks(
        signal,
        height=height,
        threshold=threshold,
        distance=distance,
        prominence=prominence,
        width=width,
        wlen=wlen,
        rel_height=rel_height,
        plateau_size=plateau_size,
    )

    return OrderedPair(x=default.x[peaks], y=signal[peaks])
