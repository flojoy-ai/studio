import asyncio
import json
import os
import sys
import traceback
import time
import yaml
from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from flojoy.utils import set_frontier_api_key

sys.path.insert(0, os.path.abspath("PYTHON"))
from .services.pre_job_service import handle_job_finished, run_jobset

from PYTHON.services.job_service import JobService
from .utils.send_to_socket import send_msg_to_socket


STATUS_CODES = yaml.load(
    open("STATUS_CODES.yml", "r", encoding="utf-8"), Loader=yaml.Loader
)
queue_watch = JobService("flojoy-watch")


def report_failure(job, connection, type, value, traceback):
    print(job, connection, type, value, traceback)


@api_view(["POST"])
def cancel_flow_chart(request):
    fc = json.loads(request.data["fc"])
    jobset_id = request.data["jobsetId"]

    queue_watch.reset(fc.get("nodes", []))
    time.sleep(2)
    msg = {
        "SYSTEM_STATUS": STATUS_CODES["STANDBY"],
        "jobsetId": jobset_id,
        "FAILED_NODES": "",
        "RUNNING_NODES": "",
    }
    asyncio.run(send_msg_to_socket(msg=msg))
    return Response(msg, status=200)


@api_view(["POST"])
def run_flow_chart(request):
    try:
        fc = json.loads(request.data["fc"])

        # cleanup all previous jobs and the related data
        queue_watch.reset(fc.get("nodes", []))
        print("cancelled previous jobs")

        jobset_id = request.data["jobsetId"]
        queue_watch.add_jobset_id(jobset_id)

        extraParams = request.data["extraParams"]

        msg = {
            "SYSTEM_STATUS": STATUS_CODES["RUN_PRE_JOB_OP"],
            "jobsetId": jobset_id,
            "FAILED_NODES": "",
            "RUNNING_NODES": "",
        }
        asyncio.run(send_msg_to_socket(msg=msg))
        asyncio.run(run_jobset(fc, jobset_id, extraParams.get("maximumRuntime")))
        return Response(status=200)
    except:
        print("Error occurred while running flow chart", flush=True)
        print(traceback.format_exc())
        return Response(status=500)


@api_view(["POST"])
def worker_response(request):
    parsed_data: dict = json.loads(request.data)
    asyncio.run(send_msg_to_socket(parsed_data))
    print("worker response forwarded")

    job_id: str = parsed_data.get("NODE_RESULTS", {}).get("id", None)
    jobset_id: str = parsed_data.get("jobsetId", None)

    if job_id is not None and jobset_id is not None:
        print(f"Node result received for job_id: {job_id} jobset_id: {jobset_id}")
        handle_job_finished(job_id, jobset_id)

    response = {
        "success": True,
    }

    return Response(response, status=200)


@api_view(["POST"])
def set_user_api_key(request):
    key = request.data
    api_key = key["key"]
    set_frontier_api_key(api_key)

    response = {
        "success": True,
        "data": api_key,
    }
    return Response(response, status=200)
