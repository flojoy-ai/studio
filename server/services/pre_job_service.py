import yaml
import pkg_resources
from datetime import datetime
from ..utils.install_package import install_packages
from ..utils.send_to_socket import send_msg_to_socket

import os, sys

dir_path = os.path.dirname(os.path.realpath(__file__))
sys.path.append(os.path.abspath(os.path.join(dir_path, os.pardir)))


from PYTHON.services.job_service import JobService
from PYTHON.WATCH.watch import run_flowchart, job_finished


job_service = JobService("flojoy-watch")
queue_scheduler = job_service.queue


STATUS_CODES = yaml.load(
    open("STATUS_CODES.yml", "r", encoding="utf-8"), Loader=yaml.Loader
)


def report_failure(job, connection, type, value, traceback):
    print(job, connection, type, value, traceback)


def _run_flow_chart(fc: dict, jobset_id, maximum_runtime_ms: int):
    job_service.add_flojoy_watch_job_id(jobset_id)
    run_flowchart(fc=fc, jobset_id=jobset_id)


def handle_job_finished(job_id: str, jobset_id: str):
    job_finished(job_id=job_id, jobset_id=jobset_id)


async def run_jobset(fc: dict, jobset_id: str, maximum_runtime_ms: int):
    nodes = fc["nodes"]
    missing_packages = []
    socket_msg = {
        "jobsetId": jobset_id,
        "FAILED_NODES": "",
        "RUNNING_NODES": "",
        "PRE_JOB_OP": {"isRunning": True, "output": ""},
    }
    for node in nodes:
        if "pip_dependencies" in node["data"]:
            for package in node["data"]["pip_dependencies"]:
                try:
                    module = pkg_resources.get_distribution(package["name"])
                    socket_msg["PRE_JOB_OP"][
                        "output"
                    ] = f"Package: {module} is already installed!"
                    await send_msg_to_socket(socket_msg)
                except pkg_resources.DistributionNotFound:
                    pckg_str = (
                        f"{package['name']}=={package['v']}"
                        if "v" in package
                        else f"{package['name']}"
                    )
                    missing_packages.append(pckg_str)
    if len(missing_packages) > 0:
        socket_msg["PRE_JOB_OP"][
            "output"
        ] = f"{', '.join(missing_packages)} packages will be installed with pip!"
        await send_msg_to_socket(socket_msg)
        success = await install_packages(missing_packages, socket_msg)
        if success:
            socket_msg["PRE_JOB_OP"]["output"] = "Pre job operation successfull!"
            socket_msg["PRE_JOB_OP"]["isRunning"] = False
            await send_msg_to_socket(socket_msg)
            _run_flow_chart(fc, jobset_id, maximum_runtime_ms)
        else:
            socket_msg["PRE_JOB_OP"][
                "output"
            ] = "Pre job opearation failed! Look at the errors printed above!"
            socket_msg["SYSTEM_STATUS"] = STATUS_CODES["PRE_JOB_OP_FAILED"]
            await send_msg_to_socket(socket_msg)
            job_service.reset(fc.get("nodes", []))
    else:
        socket_msg["PRE_JOB_OP"]["isRunning"] = False
        socket_msg["SYSTEM_STATUS"] = (STATUS_CODES["RQ_RUN_IN_PROCESS"],)
        await send_msg_to_socket(socket_msg)
        _run_flow_chart(fc, jobset_id, maximum_runtime_ms)
