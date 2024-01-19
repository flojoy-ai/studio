import time
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
def _eval_condition(condition):
    """
    evaluates condition expression.
    returns true or false
    """
    try:
        res = eval(condition)
    except SyntaxError:
        res = False
    return res


# TODO have pydantic model for data
def run_test_sequence(data):
    data = _recursive_namespace(data)

    result_dict = {}  # maps test name to result of test (should be id in the future?)

    def run_dfs(node):
        logger.info(node)

        if not bool(node.__dict__):
            return

        match node.type:
            case "root":
                for child in node.children:
                    run_dfs(child)
            case "test":
                # TODO: support run in parallel feature

                # _stream_result_to_frontend(state="RUNNING", test_name=node.testName)

                path = node.path
                result, time_taken = _run_pytest(path)
                result_dict[node.testName] = TestResult(*(result, time_taken))

                # _stream_result_to_frontend(state="TEST_DONE", test_name=node.testName)
            case "conditional":
                match node.conditionalType:
                    case "if":
                        expression_eval = _eval_condition(node.condition)
                        if expression_eval:
                            for child in node.main:
                                run_dfs(child)
                        else:
                            for child in node.__dict__["else"]:
                                run_dfs(child)

    run_dfs(data)
    logger.info(result_dict)
