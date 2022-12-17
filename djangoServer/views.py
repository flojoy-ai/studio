from PYTHON.WATCH import *
import yaml
from django.conf import settings
import redis
from rest_framework.decorators import api_view
from rest_framework.response import Response
import json
import sys
from django.shortcuts import render
import os
from rq import Queue
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync


dir_path = os.path.dirname(os.path.realpath(__file__))
sys.path.insert(0, dir_path)
REDIS_HOST = os.environ.get('REDIS_HOST', 'localhost')
REDIS_PORT = os.environ.get('REDIS_PORT', 6379)
# Connect to our Redis instance
redis_instance = redis.StrictRedis(host=REDIS_HOST,
                                   port=REDIS_PORT, db=0)

STATUS_CODES = yaml.load(open('STATUS_CODES.yml', 'r'), Loader=yaml.Loader)
r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT)
q = Queue('flojoy-watch', connection=r)


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
def worker_response(request):
    jsonify_data = json.loads(request.data)
    send_msg_to_socket(jsonify_data)
    response = {
        'success': True,
    }
    return Response(response, status=200)


@api_view(['POST'])
def wfc(request):
    print('Flow chart payload... ', request.data['fc'][:100])

    fc = json.loads(request.data['fc'])
    jobsetId = request.data['jobsetId']
    cancel_existing_jobs = request.data['cancelExistingJobs'] if 'cancelExistingJobs' in request.data else True
    msg = {
        'SYSTEM_STATUS': STATUS_CODES['RQ_RUN_IN_PROCESS'], 'jobsetId': jobsetId, 'FAILED_NODES': '', 'RUNNING_NODES': ''}
    send_msg_to_socket(msg=msg)
    func = getattr(globals()['testwatch'], 'run')
    q.enqueue(func,
              job_timeout='3m',
              on_failure=report_failure,
              job_id=jobsetId,
              kwargs={'fc': fc, 'jobsetId': jobsetId,
                      'cancel_existing_jobs': cancel_existing_jobs},
              result_ttl=500
              )
    response = {
        'msg': STATUS_CODES['RQ_RUN_IN_PROCESS'],
    }
    return Response(response, status=200)
