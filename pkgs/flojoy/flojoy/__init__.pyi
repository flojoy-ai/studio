from typing import Optional, Union, Any, Literal, TypedDict
from pathlib import Path
from .data_container import *
from .flojoy_python import *
from .job_result_builder import *
from .flojoy_instruction import *
from .plotly_utils import *
from .module_scraper import *
from .job_result_utils import *
from .utils import *
from .parameter_types import *
from .small_memory import *
from .flojoy_node_venv import *
from .job_service import *
from .node_init import *
from .node_preflight import *
from .data_container import *
from .config import *
from .flojoy_cloud import *
from .models import *

def flojoy(
    original_function: Callable[..., DataContainer | dict[str, Any] | TypedDict | None]
    | None = None,
    *,
    node_type: Optional[str] = None,
    deps: Optional[dict[str, str]] = None,
    inject_node_metadata: bool = False,
    inject_connection: bool = False,
) -> Callable[..., DataContainer | dict[str, Any] | None]: ...
