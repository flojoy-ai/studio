from .flojoy_instruction import FLOJOY_INSTRUCTION
from .plotly_utils import data_container_to_plotly
from .data_container import DataContainer, Plotly, TextBlob, Bytes
from .dao import Dao
from typing import Any, cast, Optional

__all__ = ["get_job_result", "get_next_directions", "get_next_nodes", "get_job_result"]


def is_flow_controled(result: dict[str, Any] | DataContainer):
    if (
        FLOJOY_INSTRUCTION.FLOW_TO_DIRECTIONS in result
        or FLOJOY_INSTRUCTION.FLOW_TO_NODES in result
    ):
        return True
    return False


def get_next_directions(result: dict[str, Any] | None) -> list[str] | None:
    direction = None
    if result is None:
        return direction
    if not result.get(FLOJOY_INSTRUCTION.FLOW_TO_DIRECTIONS):
        for value in result.values():
            if isinstance(value, dict) and value.get(
                FLOJOY_INSTRUCTION.FLOW_TO_DIRECTIONS
            ):
                direction = cast(
                    list[str], value[FLOJOY_INSTRUCTION.FLOW_TO_DIRECTIONS]
                )
                break
    else:
        direction = result[FLOJOY_INSTRUCTION.FLOW_TO_DIRECTIONS]
    return direction


def get_next_nodes(result: dict[str, Any] | None) -> list[str]:
    if result is None:
        return []
    return cast(list[str], result.get(FLOJOY_INSTRUCTION.FLOW_TO_NODES, []))


def get_dc_from_result(
    result: dict[str, Any] | DataContainer | None
) -> DataContainer | None:
    if not result:
        return None
    if isinstance(result, DataContainer):
        return result
    if result.get(FLOJOY_INSTRUCTION.RESULT_FIELD):
        return result[result[FLOJOY_INSTRUCTION.RESULT_FIELD]]
    return result["data"]


def get_job_result(job_id: str) -> dict[str, Any] | DataContainer | None:
    try:
        job_result: Any = Dao.get_instance().get_job_result(job_id)
        result = get_dc_from_result(cast(dict[str, Any] | DataContainer, job_result))
        return result
    except Exception:
        return None


def get_text_blob_from_dc(dc: DataContainer) -> str | None:
    match dc.type:
        case "TextBlob":
            return dc.text_blob
        case "Bytes":
            return dc.b.decode("utf-8")
        case _:
            return None


def get_frontend_res_obj_from_result(
    result: Optional[dict[str, Any] | DataContainer]
) -> Optional[dict[str, Any]]:
    if result is None:
        return None

    # Only return a plotly fig if it is a viz node
    match result:
        case Plotly() | TextBlob() | Bytes():
            plotly_fig = data_container_to_plotly(data=result)
            return {
                "plotly_fig": plotly_fig,
                "text_blob": get_text_blob_from_dc(result),
            }

    if isinstance(result, DataContainer):
        return None

    if result.get(FLOJOY_INSTRUCTION.RESULT_FIELD):
        data = result[result[FLOJOY_INSTRUCTION.RESULT_FIELD]]
        if not data:
            return result

        plotly_fig = None
        text_blob = None
        match result:
            case Plotly() | TextBlob() | Bytes():
                plotly_fig = data_container_to_plotly(data=result)
                text_blob = get_text_blob_from_dc(result)

        return {
            **result,
            "plotly_fig": plotly_fig,
            "text_blob": text_blob,
        }
    keys = list(result.keys())
    return get_frontend_res_obj_from_result(result[keys[0]])
