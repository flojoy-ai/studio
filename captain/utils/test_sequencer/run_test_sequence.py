import asyncio
import json
import threading
import time
from captain.types.test_sequence import TestSequenceMessage
from captain.utils.config import ts_manager
from types import SimpleNamespace
import subprocess
from captain.utils.logger import logger


class TestResult:
    def __init__(self, result=None, time_taken=None):
        self.result = result
        self.time_taken = time_taken


def _run_pytest(file_path):
    """
    runs pytest file.
    returns result in boolean form and the time taken to execute the test
    """
    start_time = time.time()
    result = subprocess.run(["pytest", file_path], stdout=subprocess.PIPE)
    end_time = time.time()

    if result.returncode == 0:
        is_pass = True
    else:
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


# TODO create custom expression parser, but for now this is quick and easy
def _eval_condition(result_dict, condition):
    """
    evaluates condition expression.
    returns true or false
    """
    try:
        res = eval(condition)
    except SyntaxError:
        res = False
    return res


# TODO use TSSignaler class to abstract this funcitonality
async def _stream_result_to_frontend(state, test_id, result="", time_taken=0):
    asyncio.create_task(
        ts_manager.ws.broadcast(TestSequenceMessage(state, test_id, result, time_taken))
    )
    await asyncio.sleep(0)  # necessary for task yield
    await asyncio.sleep(0)  # necessary for task yield


# TODO have pydantic model for data
async def run_test_sequence(data):
    data = _recursive_namespace(data)

    result_dict = {}  # maps test name to result of test (should be id in the future?)

    async def run_dfs(node):
        logger.info(node)

        if not bool(node.__dict__):
            return

        match node.type:
            case "root":
                for child in node.children:
                    await run_dfs(child)

            case "test":
                # TODO: support run in parallel feature

                await _stream_result_to_frontend(state="RUNNING", test_id=node.id)
                path = node.path
                result, time_taken = _run_pytest(path)
                result_dict[node.testName] = TestResult(*(result, time_taken))
                await _stream_result_to_frontend(
                    state="TEST_DONE",
                    test_id=node.id,
                    result=result,
                    time_taken=time_taken,  # TODO result, time_taken should be together
                )

            case "conditional":
                match node.conditionalType:
                    case "if":
                        expression_eval = _eval_condition(result_dict, node.condition)
                        if expression_eval:
                            for child in node.main:
                                await run_dfs(child)
                        else:
                            for child in node.__dict__["else"]:
                                await run_dfs(child)

    await run_dfs(data)
    logger.info(result_dict)
