import asyncio
import json
import os
import sys
import time
import yaml
import requests
import logging
from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from flojoy.utils import get_frontier_api_key, set_frontier_api_key, set_frontier_s3_key

sys.path.insert(0, os.path.abspath("PYTHON"))
from .services.pre_job_service import prepare_jobs

from PYTHON.services.job_service import JobService
from .utils.send_to_socket import send_msg_to_socket


job_service = JobService("flojoy-watch")

STATUS_CODES = yaml.load(
    open("STATUS_CODES.yml", "r", encoding="utf-8"), Loader=yaml.Loader
)

logger = logging.getLogger(__name__)


def report_failure(job, connection, type, value, traceback):
    print(job, connection, type, value, traceback)


@api_view(["POST"])
def cancel_flow_chart(request):
    fc = json.loads(request.data["fc"])
    jobset_id = request.data["jobsetId"]

    job_service.reset(fc.get("nodes", []))
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
    fc = json.loads(request.data["fc"])

    # cleanup all previous jobs and the related data
    job_service.reset(fc.get("nodes", []))
    print("cancelled previous jobs")

    jobset_id = request.data["jobsetId"]
    job_service.add_jobset_id(jobset_id)

    extraParams = request.data["extraParams"]

    msg = {
        "SYSTEM_STATUS": STATUS_CODES["RUN_PRE_JOB_OP"],
        "jobsetId": jobset_id,
        "FAILED_NODES": "",
        "RUNNING_NODES": "",
    }
    asyncio.run(send_msg_to_socket(msg=msg))
    asyncio.run(prepare_jobs(fc, jobset_id, extraParams))
    return Response(status=200)


@api_view(["POST"])
def worker_response(request):
    parse_data = json.loads(request.data)
    asyncio.run(send_msg_to_socket(parse_data))
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
        "data": api_key,
    }
    return Response(response, status=200)


@api_view(["POST"])
def set_s3_key(request):
    key = request.data
    s3_name = key["name"]
    access_key = key["accessKey"]
    secret_key = key["secretKey"]
    set_frontier_s3_key(s3_name, access_key, secret_key)

    response = {
        "name": s3_name,
        "accessKey": access_key,
        "secretKey": secret_key,
    }

    return Response(response, status=200)


@api_view(["GET", "POST"])
def projects(request):
    api_key = get_frontier_api_key()

    if not api_key:
        return Response("Missing API key", status=401)

    frontier_uri = os.environ.get("FRONTIER_URI")
    if not frontier_uri:
        frontier_uri = "https://frontier.flojoy.io"

    if request.method == "POST":
        data = request.data
        res = requests.post(f"{frontier_uri}/api/projects?api_key={api_key}", json=data)
    else:
        res = requests.get(f"{frontier_uri}/api/projects?api_key={api_key}")

    logger.info(res.content)
    return Response(res.json(), status=res.status_code)


@api_view(["GET"])
def get_project(request, ref):
    api_key = get_frontier_api_key()

    if not api_key:
        return Response("Missing API key", status=401)

    frontier_uri = os.environ.get("FRONTIER_URI")
    if not frontier_uri:
        frontier_uri = "https://frontier.flojoy.io"

    res = requests.get(f"{frontier_uri}/api/projects/{ref}?api_key={api_key}")
    return Response(res.json(), status=res.status_code)
