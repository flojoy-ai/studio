import logging
import os
from captain.utils.logger import logger
from typing import List, Union
from captain.models.pytest.pytest_models import (
    RootModel,
    Collector,
    Result,
    TestDiscoveryResponse,
)
import pytest
from pytest_jsonreport.plugin import JSONReport
from captain.utils.import_utils import unload_module
import re
import pathlib
from robot.running.builder import TestSuiteBuilder


def extract_error(report: RootModel):
    """Return a list of missing libraries and a optional error message"""
    missing_lib = set()
    error_msg = None
    if not report.collectors:
        return missing_lib
    for element in report.collectors:
        if element.longrepr:
            error_message = element.longrepr
            match = re.search(r"No module named '(\w+)'", error_message)
            if match:
                missing_library = match.group(1)
                missing_lib.add(missing_library)
            else:
                error_msg = error_message
    return missing_lib, error_msg


def discover_pytest_file(
    path: str, one_file: bool, return_val: list, missing_lib: list, errors: list
):
    unload_module(path)
    plugin = JSONReport()
    pytest.main(
        ["-s", "--json-report-file=none", "--collect-only", path], plugins=[plugin]
    )
    logger.info(plugin.report)
    json_data: RootModel = RootModel.model_validate(plugin.report)
    missing_libs, error_msg = extract_error(json_data)
    missing_lib.extend(missing_libs)
    errors.append(error_msg)
    logger.info(json_data.root)

    # run dfs on the json data and collect the tests
    def dfs(
        test_list: List[TestDiscoveryResponse],
        node: Union[RootModel, Collector, Result],
    ):
        match node:
            case RootModel():
                if not node.collectors:
                    return
                for collector in node.collectors:
                    dfs(test_list, collector)
            case Collector():
                for result in node.result:
                    dfs(test_list, result)
            case Result():
                test_list.append(
                    TestDiscoveryResponse(
                        test_name=node.nodeid.replace(" ", "_"),
                        path=pathlib.Path(
                            os.path.join(json_data.root, node.nodeid)
                        ).as_posix(),
                    )
                )

    test_list: List[TestDiscoveryResponse] = []
    dfs(test_list, json_data)
    if len(test_list) == 1:
        # No test, just the file itself in the list
        return
    if one_file:
        return_val.append(
            TestDiscoveryResponse(
                test_name=os.path.basename(path), path=pathlib.Path(path).as_posix()
            )
        )
    else:
        return_val.extend(test_list)


def discover_robot_file(
    path: str, one_file: bool, return_val: list, errors: list
):
    try:
        builder = TestSuiteBuilder()
        suite = builder.build(path)
        logging.info(f"Suite: {suite} - suites in it: {suite.suites} - tests in it: {suite.tests}")
        if one_file:
            return_val.append(suite.full_name)
        else:
            for test in suite.tests:
                return_val.append(TestDiscoveryResponse(
                    test_name=test.full_name, path=pathlib.Path(path).as_posix()
                ))

    except Exception as e:
        errors.append(str(e))
