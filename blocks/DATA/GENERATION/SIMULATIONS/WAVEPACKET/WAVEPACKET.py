import numpy as np
import scipy.sparse as spa
from scipy.sparse.linalg import splu
from flojoy import flojoy, OrderedPair, SmallMemory, DefaultParams
from typing import Optional


def gaussian_wavepacket(x, x0, k, sigma=0.1):
    # One dimensional Gaussian wavepacket.
    x = np.asarray(x)
    g = np.sqrt(1 / np.sqrt(np.pi) / sigma) * np.exp(-((x - x0) ** 2) / 2 / sigma**2)

    return np.exp(1j * k * (x - x0)) * g


def CrankNicolson(psi, V, x, dt):
    # Crank-Nicolson method for the 1D Schrodinger equation.

    # No. of spatial grid points
    J = x.size - 1
    dx = x[1] - x[0]

    # the external potential
    V_e = spa.diags(V)
    # the kinetic operator
    O_k = np.ones(J + 1)
    T = (-1 / 2 / dx**2) * spa.spdiags([O_k, -2 * O_k, O_k], [-1, 0, 1], J + 1, J + 1)

    # the two unitary matrices
    U2 = spa.eye(J + 1) + (1j * 0.5 * dt) * (T + V_e)
    U1 = spa.eye(J + 1) - (1j * 0.5 * dt) * (T + V_e)
    # splu requires CSC matrix format for efficient decomposition
    U2 = U2.tocsc()
    LU = splu(U2)

    b = U1.dot(psi)
    PSI_t = LU.solve(b)

    return PSI_t


memory_key = "WAVEPACKET"


@flojoy(inject_node_metadata=True)
def WAVEPACKET(
    default_params: DefaultParams,
    default: Optional[OrderedPair] = None,
    L_box: float = 20,
    center: float = 0,
    momentum: float = 5,
    sigma: float = 1,
    dt: float = 0.2,
) -> OrderedPair:
    """Approximate the behaviour of a 1D Gaussian wavepacket in an infinite-well potential box.

    This example uses the Crank-Nicolson Method to solve the 1D Schrodinger equation.

    Further reading:
    http://staff.ustc.edu.cn/~zqj/posts/Numerical_TDSE/

    Parameters
    ----------
    L_box : float
        The width of the box in Bohr lengths.
    center : float
        The center of the initial wavepacket.
    momentum : float
        The momentum of the initial wavepacket.
    sigma : float
        The width of the initial wavepacket.
    dt : float
        Time steps in atomic units, 1 a.u. = 24.188 as.

    Returns
    -------
    OrderedPair
        The most recent wavepacket.
    """

    node_id = default_params.node_id

    psi_t = SmallMemory().read_memory(node_id, memory_key)
    if psi_t is None:
        initialize = True
    elif isinstance(psi_t, np.ndarray):
        initialize = False
    else:
        raise TypeError("Error loading object from SmallMemory.")

    # Box parameters.
    xmin = -L_box / 2.0  # left boundary
    J = 999  # No. of spatial grid points
    x = np.linspace(xmin, xmin + L_box, J + 1, endpoint=True)

    # The gaussian wavepacket as the initial wavefunction.
    psi0 = gaussian_wavepacket(x, x0=center, k=momentum, sigma=sigma)
    V_e = np.zeros_like(x)  # The externial potentials.

    # The time evolution of the Schrodinger equation.
    if initialize:
        PSI = CrankNicolson(psi0, V_e, x, dt)
    elif not initialize:
        PSI = CrankNicolson(psi_t, V_e, x, dt)

    SmallMemory().write_to_memory(node_id, memory_key, PSI)
    y = np.abs(PSI)

    return OrderedPair(x=x, y=y)
