import traceback
import asyncio
import time
from typing import Union, List, Callable
from flojoy_cloud.client import FlojoyCloudException
import pydantic
from captain.models.test_sequencer import (
    IfNode,
    StatusTypes,
    TestNode,
    TestRootNode,
    TestSequenceElementNode,
)
from captain.parser.bool_parser.expressions.models import Variable
from captain.types.test_sequence import MsgState, TestSequenceMessage
from captain.utils.config import ts_manager
from types import SimpleNamespace
import subprocess
from captain.utils.logger import logger
from captain.parser.bool_parser.bool_parser import eval_expression
from flojoy_cloud import FlojoyCloud
from pkgs.flojoy.flojoy.env_var import get_env_var


class TestResult:
    def __init__(self, test_node: TestNode, result: bool, time_taken: float):
        self.test_node = test_node
        self.result = result
        self.time_taken = time_taken


class TestError:
    def __init__(self, error: str):
        self.error = error


def _run_pytest(file_path):
    """
    runs pytest file.
    returns result in boolean form and the time taken to execute the test
    """
    start_time = time.time()
    result = subprocess.run(
        ["pytest", file_path], stdout=subprocess.PIPE, stderr=subprocess.PIPE
    )
    end_time = time.time()

    if result.returncode == 0:
        is_pass = True
    else:
        logger.info(
            f"TEST {file_path} FAILED:\nSTDOUT: {result.stdout.decode()}\nSTDERR: {result.stderr.decode()}"
        )
        is_pass = False
    return is_pass, end_time - start_time


def _recursive_namespace(d):
    """
    instead of doing data["element"] we can do data.element
    """
    if isinstance(d, list):
        return list(map(lambda x: _recursive_namespace(x), d))

    if isinstance(d, dict):
        for k, v in d.items():
            d[k] = _recursive_namespace(v)
        return SimpleNamespace(**d)

    return d


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


async def _case_root(node: TestRootNode, **kwargs) -> Extract:
    return lambda _: node.children, None


async def _case_test(node: TestNode, **kwargs) -> Extract:
    # TODO: support run in parallel feature
    await _stream_result_to_frontend(MsgState.RUNNING, test_id=node.id)
    result, time_taken = _run_pytest(node.path)
    await _stream_result_to_frontend(
        state=MsgState.TEST_DONE,
        test_id=node.id,
        result=result,
        time_taken=time_taken,  # TODO result, time_taken should be together
        is_saved_to_cloud=False,
    )
    return lambda _: None, TestResult(node, result, time_taken)


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
        "test": (None, _case_test),
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
async def run_test_sequence(data):
    data = pydantic.TypeAdapter(TestRootNode).validate_python(data)
    identifiers = set(data.identifiers)
    context = Context({}, identifiers)
    try:

        async def run_dfs(node: TestRootNode | TestSequenceElementNode):
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

        await _stream_result_to_frontend(state=MsgState.TEST_SET_START)
        await run_dfs(data)  # run tests
        await _stream_result_to_frontend(state=MsgState.TEST_SET_DONE)
    except Exception as e:
        await _stream_result_to_frontend(state=MsgState.ERROR, error=str(e))
        logger.error(f"{e}: {traceback.format_exc()}")


async def _case_test_upload(node: TestNode, hardware_id, project_id) -> Extract:
    cloud = FlojoyCloud(workspace_secret=get_env_var("FLOJOY_CLOUD_KEY"))

    def reverse_id(test_name) -> str:
        tests = cloud.get_all_tests_by_project_id(project_id)
        for i in tests:
            if i.name == test_name:
                return str(i.id)
        raise KeyError(f"No cloud test for {test_name}")

    status = node.status
    if status != StatusTypes.pending:
        passed = True if status == StatusTypes.pass_ else False
        try:
            await _stream_result_to_frontend(MsgState.RUNNING, test_id=node.id)
            node.is_saved_to_cloud = False
            test_name = node.test_name.split("::")[-1]
            cloud.upload(
                data=passed,
                test_id=reverse_id(test_name),
                hardware_id=hardware_id,
                name=test_name,
                passed=passed,
            )
            node.is_saved_to_cloud = True
            logger.info(f"{test_name}: Uploaded to cloud")
        except KeyError as err:
            # TODO: Return error to user
            logger.error(err)
        except FlojoyCloudException as err:
            logger.error(err)
            raise FlojoyCloudException("Failed to upload to the cloud.") from err
        finally:
            await _stream_result_to_frontend(
                state=MsgState.TEST_DONE,
                test_id=node.id,
                result=passed,
                time_taken=node.completion_time,
                is_saved_to_cloud=node.is_saved_to_cloud,
            )
    else:
        logger.error("Should Never Reach Here")
    return lambda _: None, TestResult(
        node, True if status == StatusTypes.pass_ else False, node.completion_time
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

        await _stream_result_to_frontend(state=MsgState.TEST_SET_START)
        await run_dfs(data)  # Export tests
        await _stream_result_to_frontend(state=MsgState.TEST_SET_DONE)
    except Exception as e:
        await _stream_result_to_frontend(state=MsgState.ERROR, error=str(e))
        logger.error(f"{e}: {traceback.format_exc()}")
