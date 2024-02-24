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


def check_missing_imports(report: JSONReport):
    missing_lib = set()
    if not report.report:
        return missing_lib
    if "collectors" not in report.report:
        return missing_lib
    for element in report.report['collectors']:
        if "longrepr" in element:
            error_message = element["longrepr"]
            match = re.search(r"No module named '(\w+)'", error_message)
            if match:
                missing_library = match.group(1)
                logger.info(f"Missing library: {missing_library}")
                missing_lib.add(missing_library)
            else:
                logger.error(f"Error occured while discovering test: {error_message}")
    return missing_lib 


def discover_pytest_file(path: str, one_file: bool, return_val: list, missing_lib: list):
    unload_module(path)
    plugin = JSONReport()
    pytest.main(
        ["-s", "--json-report-file=none", "--collect-only", path], plugins=[plugin]
    )
    missing_lib.extend(check_missing_imports(plugin))
    json_data: RootModel = RootModel.model_validate(plugin.report)
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
                        path=os.path.join(json_data.root, node.nodeid),
                    )
                )

    test_list: List[TestDiscoveryResponse] = []
    dfs(test_list, json_data)
    logger.info(f"Test list: {test_list}")
    if len(test_list) == 1:
        # No test, just the file itself in the list
        return
    if one_file:
        return_val.append(
            TestDiscoveryResponse(test_name=os.path.basename(path), path=path)
        )
    else:
        return_val.extend(test_list)
