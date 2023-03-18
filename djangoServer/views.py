import os
import sys
import json
import yaml
from PYTHON.WATCH import *
from datetime import datetime
from django.shortcuts import render
from asgiref.sync import async_to_sync
from rest_framework.response import Response
from channels.layers import get_channel_layer
from rest_framework.decorators import api_view
from PYTHON.services.job_service import JobService
import time

dir_path = os.path.dirname(os.path.realpath(__file__))
sys.path.insert(0, dir_path)

job_service = JobService('flojoy-watch')
q = job_service.queue
STATUS_CODES = yaml.load(open('STATUS_CODES.yml', 'r'), Loader=yaml.Loader)

print('queue flojoy-watch isEmpty? ', q.is_empty())


def test_socket(request):
    return render(request, 'test_socket.html')


def report_failure(job, connection, type, value, traceback):
    print(job, connection, type, value, traceback)


def send_msg_to_socket(msg: dict):
    layer = get_channel_layer()
    async_to_sync(layer.group_send)('flojoy', {
        'type': 'worker_response',
        **msg
    })


@api_view(['POST'])
def cancel_flow_chart(request):
    fc = json.loads(request.data['fc'])
    jobset_id = request.data['jobsetId']

    job_service.reset(fc.get('nodes', []))
    time.sleep(2)
    msg = {
        'SYSTEM_STATUS': STATUS_CODES['STANDBY'],
        'jobsetId': jobset_id,
        'FAILED_NODES': '',
        'RUNNING_NODES': ''
    }
    send_msg_to_socket(msg=msg)
    return Response(msg, status=200)


@api_view(['POST'])
def run_flow_chart(request):
    fc = json.loads(request.data['fc'])

    # cleanup all previous jobs and the related data
    job_service.reset(fc.get('nodes', []))

    jobset_id = request.data['jobsetId']
    job_service.add_jobset_id(jobset_id)

    msg = {
        'SYSTEM_STATUS': STATUS_CODES['RQ_RUN_IN_PROCESS'],
        'jobsetId': jobset_id,
        'FAILED_NODES': '',
        'RUNNING_NODES': ''
    }
    send_msg_to_socket(msg=msg)

    func = getattr(globals()['watch'], 'run')
    print('func:', func)
    scheduler_job_id = f'{jobset_id}_{datetime.now()}'
    job_service.add_flojoy_watch_job_id(scheduler_job_id)

    q.enqueue(func,
              on_failure=report_failure,
              job_id=scheduler_job_id,
              kwargs={'fc': fc,
                      'jobsetId': jobset_id,
                      'scheduler_job_id': scheduler_job_id
                      },
              )

    response = {
        'msg': STATUS_CODES['RQ_RUN_IN_PROCESS'],
    }
    return Response(response, status=200)


@api_view(['POST'])
def worker_response(request):
    parse_data = json.loads(request.data)
    send_msg_to_socket(parse_data)
    response = {
        'success': True,
    }
    return Response(response, status=200)
