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


def discover_pytest_file(path: str, one_file: bool, return_val: list):
    plugin = JSONReport()
    pytest.main(
        ["-s", "--json-report-file=none", "--collect-only", path], plugins=[plugin]
    )
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
    if one_file:
        return_val.append(TestDiscoveryResponse(test_name=os.path.basename(path), path=path))
    dfs(test_list, json_data)
    logger.info(test_list)
    return_val.extend(test_list)

