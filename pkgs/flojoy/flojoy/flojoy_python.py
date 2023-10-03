from contextlib import ContextDecorator
import json
import os
import traceback
from functools import wraps


from .models.JobResults.JobFailure import JobFailure
from .models.JobResults.JobSuccess import JobSuccess

from .node_init import NodeInitService
from .data_container import DataContainer, Stateful
from .utils import PlotlyJSONEncoder
from typing import Callable, Any, Optional
from .job_result_utils import get_frontend_res_obj_from_result, get_dc_from_result
from .utils import send_to_socket, get_hf_hub_cache_path
from .config import logger
from .parameter_types import format_param_value
from inspect import signature
from .job_service import JobService
from timeit import default_timer as timer
from .connection_manager import DeviceConnectionManager

__all__ = ["flojoy", "DefaultParams", "display"]


def fetch_inputs(previous_jobs: list[dict[str, str]]):
    """
    Queries for job results

    Parameters
    ----------
    previous_jobs : list of jobs that directly precede this node.
    Each item representing a job contains `job_id` and `input_name`.
    `input_name` is the port where the previous job with `job_id` connects to.

    Returns
    -------
    inputs : list of DataContainer objects
    """
    dict_inputs: dict[str, DataContainer | list[DataContainer]] = dict()

    try:
        for prev_job in previous_jobs:
            prev_job_id = prev_job.get("job_id")
            input_name = prev_job.get("input_name", "")
            multiple = prev_job.get("multiple", False)
            edge = prev_job.get("edge", "")

            logger.debug(
                "fetching input from prev job id:",
                prev_job_id,
                " for input:",
                input_name,
                "edge: ",
                edge,
            )

            job_result = JobService().get_job_result(prev_job_id)
            if not job_result:
                raise ValueError(
                    f"Tried to get job result from {prev_job_id} but it was None"
                )

            result = (
                get_dc_from_result(job_result[edge])
                if edge != "default"
                else get_dc_from_result(job_result)
            )
            if result is not None:
                logger.debug(f"got job result from {prev_job_id}")
                if multiple:
                    if input_name not in dict_inputs:
                        dict_inputs[input_name] = [result]
                    else:
                        dict_inputs[input_name].append(result)
                else:
                    dict_inputs[input_name] = result

    except Exception:
        logger.debug(traceback.format_exc())

    return dict_inputs


class DefaultParams:
    def __init__(
        self, node_id: str, job_id: str, jobset_id: str, node_type: str
    ) -> None:
        self.node_id = node_id
        self.job_id = job_id
        self.jobset_id = jobset_id
        self.node_type = node_type


class cache_huggingface_to_flojoy(ContextDecorator):
    """Context manager to override the HF_HOME env var"""

    def __enter__(self):
        self.old_env_var = os.environ.get("HF_HOME")
        os.environ["HF_HOME"] = get_hf_hub_cache_path()
        return self

    def __exit__(self, *exc):
        if self.old_env_var is None:
            del os.environ["HF_HOME"]
        else:
            os.environ["HF_HOME"] = self.old_env_var
        return False


def display(
    original_function: Callable[..., DataContainer | dict[str, Any]] | None = None
):
    return original_function


def flojoy(
    original_function: Callable[..., Optional[DataContainer | dict[str, Any]]]
    | None = None,
    *,
    node_type: Optional[str] = None,
    deps: Optional[dict[str, str]] = None,
    inject_node_metadata: bool = False,
    inject_connection: bool = False,
):
    """
    Decorator to turn Python functions with numerical return
    values into Flojoy nodes.

    @flojoy is intended to eliminate boilerplate in connecting
    Python scripts as visual nodes

    Into whatever function it wraps, @flojoy injects
    1. the last node's input as list of DataContainer object
    2. parameters for that function (either set by the user or default)

    Parameters
    ----------
    `func`: Python function that returns DataContainer object

    Returns
    -------
    A dict containing DataContainer object

    Usage Example
    -------------
    ```
    @flojoy
    def SINE(dc_inputs:list[DataContainer], params:dict[str, Any]):

        logger.debug('params passed to SINE', params)

        dc_input = dc_inputs[0]

        output = DataContainer(
            x=dc_input.x,
            y=np.sin(dc_input.x)
        )
        return output
    ```

    ## equivalent to: decorated_sine = flojoy(SINE)
    ```
    pj_ids = [123, 456]
    logger.debug(SINE(previous_job_ids = pj_ids, mock = True))
    ```
    """

    def decorator(func: Callable[..., Optional[DataContainer | dict[str, Any]]]):
        # Wrap func here to override the HF_HOME env var
        func = cache_huggingface_to_flojoy()(func)

        @wraps(func)
        def wrapper(
            node_id: str,
            job_id: str,
            jobset_id: str,
            previous_jobs: list[dict[str, str]] = [],
            ctrls: dict[str, Any] | None = None,
        ):
            try:
                logger.debug("previous jobs:", previous_jobs)
                # Get command parameters set by the user through the control panel
                func_params: dict[str, Any] = {}
                if ctrls is not None:
                    for _, input in ctrls.items():
                        param = input["param"]
                        value = input["value"]
                        func_params[param] = format_param_value(value, input["type"])
                func_params["type"] = "default"

                logger.debug(
                    "executing node_id:",
                    node_id,
                    "previous_jobs:",
                    previous_jobs,
                )
                dict_inputs = fetch_inputs(previous_jobs)

                # constructing the inputs
                logger.debug(f"constructing inputs for {func.__name__}")
                args: dict[str, Any] = {}
                sig = signature(func)

                args = {**args, **dict_inputs}

                for param, value in func_params.items():
                    if param in sig.parameters:
                        args[param] = value
                if inject_node_metadata:
                    args["default_params"] = DefaultParams(
                        job_id=job_id,
                        node_id=node_id,
                        jobset_id=jobset_id,
                        node_type="default",
                    )

                logger.debug(node_id, " params: ", args.keys())

                # check if node has an init container and if so, inject it
                if NodeInitService().has_init_store(node_id):
                    args["init_container"] = NodeInitService().get_init_store(node_id)

                if inject_connection:
                    print("injecting connection", flush=True)
                    device = args["connection"]
                    print(f"device handle: {device}", flush=True)
                    id = device.get_id()
                    connection = DeviceConnectionManager.get_connection(id)
                    args["connection"] = connection

                ##########################
                # calling the node function
                ##########################
                dc_obj = func(**args)  # DataContainer object from node
                ##########################
                # end calling the node function
                ##########################

                # some special nodes like LOOP return dict instead of `DataContainer`
                if isinstance(dc_obj, DataContainer) and not isinstance(
                    dc_obj, Stateful
                ):
                    dc_obj.validate()  # Validate returned DataContainer object
                elif dc_obj is not None:
                    for value in dc_obj.values():
                        if isinstance(value, DataContainer):
                            value.validate()

                # post result to the job service so we can get it later if needed
                JobService().post_job_result(job_id, dc_obj)

                # Package the result and return it
                FN = func.__name__
                result = get_frontend_res_obj_from_result(dc_obj)
                return JobSuccess(
                    result=result,
                    fn=FN,
                    node_id=node_id,
                    jobset_id=jobset_id,
                )

            except Exception as e:
                logger.error(str(e))
                logger.error("error occured while running the node")
                logger.debug(traceback.format_exc())
                return JobFailure(
                    func_name=func.__name__,
                    node_id=node_id,
                    error=str(e),
                    jobset_id=jobset_id,
                )

        return wrapper

    if original_function:
        return decorator(original_function)

    return decorator
