import asyncio
import subprocess
import time
from flojoy_cloud.client import FlojoyCloudException, FlojoyCloud
from flojoy_cloud.measurement import MeasurementData
from flojoy_cloud import test_sequencer
import traceback
from typing import Callable, List, Union
import pydantic
from captain.internal.manager import TSManager

from captain.models.test_sequencer import (
    IfNode,
    StatusTypes,
    TestNode,
    TestRootNode,
    TestSequenceElementNode,
    TestTypes,
)
from captain.parser.bool_parser.bool_parser import eval_expression
from captain.parser.bool_parser.expressions.models import Variable
from captain.types.test_sequence import MsgState, TestSequenceMessage
from captain.types.worker import PoisonPill
from captain.utils.config import ts_manager
from captain.utils.logger import logger
from pkgs.flojoy.flojoy.env_var import get_env_var


class TestResult:
    def __init__(
        self,
        test_node: TestNode,
        result: bool,
        time_taken: float,
        error: str | None = None,
    ):
        self.test_node = test_node
        self.result = result
        self.time_taken = time_taken
        self.error = error


class TestError:
    def __init__(self, error: str):
        self.error = error


class Context:
    def __init__(
        self,
        result_dict: dict[str, TestResult],
        identifiers: set[str],
    ):
        self.result_dict = result_dict
        self.identifiers = identifiers


Extract = tuple[
    Callable[[Context], Union[List[TestRootNode], List[TestSequenceElementNode], None]],
    Union[TestResult, None],
]


def _with_stream_test_result(func: Callable[[TestNode], Extract]):
    # TODO: support run in parallel feature
    async def wrapper(node: TestNode) -> Extract:
        await _stream_result_to_frontend(MsgState.running, test_id=node.id, result=StatusTypes.pending)
        test_sequencer._set_output_loc(node.id)
        children_getter, test_result = func(node)
        if test_result is None:
            raise Exception(f"{node.id}: Test returned None")
        else:
            await _stream_result_to_frontend(
                state=MsgState.test_done,
                test_id=node.id,
                result=StatusTypes.pass_ if test_result.result else StatusTypes.fail,
                time_taken=test_result.time_taken,  # TODO result, time_taken should be together
                error=test_result.error,
                is_saved_to_cloud=False,
            )
        return children_getter, test_result

    return wrapper


@_with_stream_test_result
def _run_python(node: TestNode) -> Extract:
    """
    runs python file.
    @params file_path: path to the file
    @returns:
        bool: result of the test
        float: time taken to execute the test
        str: error message if any
    """
    start_time = time.time()
    logger.info(f"[Python Runner] Running {node.path}")
    result = subprocess.run(
        ["python", node.path], stdout=subprocess.PIPE, stderr=subprocess.PIPE
    )
    logger.info(f"[Python Runner] Running {result}")
    end_time = time.time()
    if result.returncode == 0:
        is_pass = True
    else:
        logger.info(
            f"TEST {node.path} FAILED:\nSTDOUT: {result.stdout.decode()}\nSTDERR: {result.stderr.decode()}"
        )
        is_pass = False
    return (
        lambda _: None,
        TestResult(
            node,
            is_pass,
            end_time - start_time,
            result.stderr.decode() if not is_pass else None,
        ),
    )


@_with_stream_test_result
def _run_pytest(node: TestNode) -> Extract:
    """
    @params file_path: path to the file
    @returns:
        bool: result of the test
        float: time taken to execute the test
        str: error message if any
    """
    start_time = time.time()
    result = subprocess.run(
        ["pytest", node.path], stdout=subprocess.PIPE, stderr=subprocess.PIPE
    )
    end_time = time.time()

    if result.returncode == 0:
        is_pass = True
    else:
        logger.info(
            f"TEST {node.path} FAILED:\nSTDOUT: {result.stdout.decode()}\nSTDERR: {result.stderr.decode()}"
        )
        is_pass = False
    return (
        lambda _: None,
        TestResult(
            node,
            is_pass,
            end_time - start_time,
            result.stdout.decode() if not is_pass else None,
        ),
    )


def _eval_condition(
    result_dict: dict[str, TestResult], condition: str, identifiers: set[str]
):
    """
    evaluates condition expression.
    returns true or false
    """

    # convert result_dict to symbol table
    symbol_table: dict[str, Variable] = {}
    for key, val in result_dict.items():
        symbol_table[key] = Variable(val.result, val.time_taken)

    try:
        res = eval_expression(
            condition,
            symbol_table,
            identifiers,
        )
    except Exception as e:
        logger.error(e)
        raise e
    return res


# TODO use TSSignaler class to abstract this funcitonality
async def _stream_result_to_frontend(
    state: MsgState,
    test_id: str = "",
    result: StatusTypes = StatusTypes.pending,
    time_taken: float = 0,
    is_saved_to_cloud: bool = False,
    error: str | None = None,
):
    asyncio.create_task(
        ts_manager.ws.broadcast(
            TestSequenceMessage(
                state.value, test_id, result.value, time_taken, is_saved_to_cloud, error
            )
        )
    )
    await asyncio.sleep(0)  # necessary for task yield
    await asyncio.sleep(0)  # still necessary for task yield


async def _case_root(node: TestRootNode, **kwargs) -> Extract:
    return lambda _: node.children, None


async def _case_if_node(node: IfNode, **kwargs) -> Extract:
    def get_next_children_from_context(context: Context):
        result_dict, identifiers = context.result_dict, context.identifiers
        expression_eval = _eval_condition(result_dict, node.condition, identifiers)
        if expression_eval:
            return node.main
        else:
            return node.else_

    return get_next_children_from_context, None


map_to_handler_run = (
    "type",
    {
        "root": (None, _case_root),
        # "test": (None, _case_test),
        "test": (
            "test_type",
            {
                TestTypes.python: (None, _run_python),
                TestTypes.pytest: (None, _run_pytest),
            },
        ),
        "conditional": (
            "conditional_type",
            {
                "if": (None, _case_if_node),
            },
        ),
    },
)


async def _extract_from_node(
    node: TestRootNode | TestSequenceElementNode, map_to_handler, **kwargs
) -> Extract:
    if not bool(node.__dict__):
        return lambda _: None, None
    matcher, cur = map_to_handler
    while not callable(cur):
        matcher, cur = cur[node.__dict__[matcher]]
    children_getter, test_result = await cur(
        node, **kwargs
    )  # sus name for the variable
    return children_getter, test_result


# TODO have pydantic model for data, convert camelCase to snake_case
async def run_test_sequence(data, ts_manager: TSManager):
    data = pydantic.TypeAdapter(TestRootNode).validate_python(data)
    identifiers = set(data.identifiers)
    context = Context({}, identifiers)
    try:

        async def run_dfs(node: TestRootNode | TestSequenceElementNode):
            if isinstance(node, TestNode):
                await ts_manager.wait_if_paused(node.id)

            children_getter, test_result = await _extract_from_node(
                node, map_to_handler_run
            )

            if test_result:
                context.result_dict[test_result.test_node.test_name] = test_result

            children = children_getter(context)
            if not children:
                return
            for child in children:
                await run_dfs(child)

        await _stream_result_to_frontend(state=MsgState.test_set_start)
        await run_dfs(data)  # run tests
        await _stream_result_to_frontend(state=MsgState.test_set_done)
    except PoisonPill as e:
        logger.info(f"PoisonPill received: {e}")
        # Broadcast handled in TSManager
    except Exception as e:
        await _stream_result_to_frontend(state=MsgState.error, error=str(e))
        logger.error(f"{e}: {traceback.format_exc()}")


def _with_stream_test_upload(func: Callable[[TestNode, str, str], Extract]):
    async def wrapper(node: TestNode, hardware_id: str, project_id: str) -> Extract:
        await _stream_result_to_frontend(MsgState.running, test_id=node.id)
        try:
            children_getter, test_result = func(node, hardware_id, project_id)
            return children_getter, test_result
        except Exception as e:
            raise e
        finally:
            await _stream_result_to_frontend(
                state=MsgState.test_done,
                test_id=node.id,
                result=node.status,
                time_taken=node.completion_time if node.completion_time else -1,
                is_saved_to_cloud=node.is_saved_to_cloud,
            )

    return wrapper


@_with_stream_test_upload
def _case_test_upload(node: TestNode, hardware_id: str, project_id: str) -> Extract:
    if node.completion_time is None:
        raise Exception(f"{node.id}: Can't upload a test that wasn't run")
    if node.export_to_cloud:
        cloud = FlojoyCloud(
            workspace_secret=get_env_var("FLOJOY_CLOUD_WORKSPACE_SECRET")
        )

        def reverse_id(test_name) -> str:
            tests = cloud.get_all_tests_by_project_id(project_id)
            for i in tests:
                if i.name == test_name:
                    return str(i.id)
            raise KeyError(f"No cloud test for {test_name}")

        if node.status != StatusTypes.pending:
            if node.completion_time is None:
                raise Exception(f"{node.id}: Unexpected None for completion_time")
            passed = True if node.status == StatusTypes.pass_ else False
            data = test_sequencer._get_most_recent_data(node.id)
            if not isinstance(data, MeasurementData):
                logger.info(
                    f"{node.id}: Unexpected data type for test data: {type(data)}"
                )
                data = passed
            test_name = node.test_name
            try:
                node.is_saved_to_cloud = False
                cloud.upload(
                    data=data,
                    test_id=reverse_id(test_name),
                    hardware_id=hardware_id,
                    name=test_name,
                    passed=passed,
                )
                node.is_saved_to_cloud = True
                logger.info(f"{test_name}: Uploaded to cloud")
            except KeyError:  # Not in cloud: create a new test
                cloud.create_test(test_name, project_id, measurement_type="boolean")
                cloud.upload(
                    data=passed,
                    test_id=reverse_id(test_name),
                    hardware_id=hardware_id,
                    name=test_name,
                    passed=passed,
                )
                node.is_saved_to_cloud = True
                logger.info(f"{test_name}: Uploaded to cloud")
            except FlojoyCloudException as err:
                logger.error(err)
                if "NOT_FOUND" in str(err):
                    raise FlojoyCloudException(
                        "Fail to upload to the cloud: Please make sure the hardware id is correct"
                    ) from err
                else:
                    raise FlojoyCloudException(
                        f"Failed to upload to the cloud: {err}"
                    ) from err
        else:
            raise ValueError("Uploading a pending test is not allowed.")
    return lambda _: None, TestResult(
        node, True if node.status == StatusTypes.pass_ else False, node.completion_time
    )


map_to_handler_upload = (
    "type",
    {
        "root": (None, _case_root),
        "test": (None, _case_test_upload),
        "conditional": (
            "conditional_type",
            {
                "if": (None, _case_if_node),
            },
        ),
    },
)


async def export_test_sequence(data, hardware_id, project_id):
    data = pydantic.TypeAdapter(TestRootNode).validate_python(data)
    identifiers = set(data.identifiers)
    context = Context({}, identifiers)
    try:
        # Walking the tree with the same sequence as the last run and upload de TestNode
        async def run_dfs(node: TestRootNode | TestSequenceElementNode):
            children_getter, test_result = await _extract_from_node(
                node,
                map_to_handler_upload,
                hardware_id=hardware_id,
                project_id=project_id,
            )
            if test_result:
                context.result_dict[test_result.test_node.test_name] = test_result
            children = children_getter(context)
            if not children:
                return
            for child in children:
                await run_dfs(child)

        await _stream_result_to_frontend(state=MsgState.test_set_export)
        await run_dfs(data)  # Export tests
        await _stream_result_to_frontend(state=MsgState.test_set_done)
    except Exception as e:
        await _stream_result_to_frontend(state=MsgState.error, error=str(e))
        logger.error(f"{e}: {traceback.format_exc()}")
