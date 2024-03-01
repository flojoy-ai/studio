import asyncio
import traceback
from captain.utils.logger import logger
from captain.types.test_sequence import MsgState, TestSequenceMessage
from captain.utils.config import ts_manager


async def _stream_result_to_frontend(
    state: MsgState,
    test_id: str = "",
    result: bool = False,
    time_taken: float = 0,
    is_saved_to_cloud: bool = False,
    error: str | None = None,
):
    asyncio.create_task(
        ts_manager.ws.broadcast(
            TestSequenceMessage(
                state.value, test_id, result, time_taken, is_saved_to_cloud, error
            )
        )
    )
    await asyncio.sleep(0)  # necessary for task yield
    await asyncio.sleep(0)  # still necessary for task yield


def _with_error_report(func):
    async def reported_func(*args, **kwargs):
        try:
            await func(*args, **kwargs)
        except Exception as e:
            await _stream_result_to_frontend(state=MsgState.ERROR, error=str(e))
            logger.error(f"{e}: {traceback.format_exc()}")

    return reported_func
