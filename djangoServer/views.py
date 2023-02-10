from datetime import datetime
from PYTHON.WATCH import *
import yaml
from rest_framework.decorators import api_view
from rest_framework.response import Response
import json
import sys
from django.shortcuts import render
import os
from rq import Queue
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from rq.command import send_stop_job_command
from rq.exceptions import InvalidJobOperation
from PYTHON.utils.redis_utils import RedisService
from PYTHON.utils.job_utils import delete_all_jobs

dir_path = os.path.dirname(os.path.realpath(__file__))
sys.path.insert(0, dir_path)


STATUS_CODES = yaml.load(open('STATUS_CODES.yml', 'r'), Loader=yaml.Loader)

r = RedisService.get_instance().r
q = Queue('flojoy-watch', connection=r)
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
def worker_response(request):
    jsonify_data = json.loads(request.data)
    send_msg_to_socket(jsonify_data)
    response = {
        'success': True,
    }
    return Response(response, status=200)




def stop_running_jobs(jobs: list, jobset_id: str):
    if len(jobs) > 0:
        for job_id in jobs:
            try:
                send_stop_job_command(
                    connection=r, job_id=job_id.decode('utf-8'))
            # if job is currently not executing (e.g. finished, etc.), ignore the exception
            except InvalidJobOperation:
                pass
            r.lrem('{}_watch'.format(jobset_id), 1, job_id.decode('utf-8'))
        for job_id in q.failed_job_registry.get_job_ids():
            q.delete(job_id)


@api_view(['POST'])
def wfc(request):

    print('Flow chart payload... ', request.data['fc'][:100])

    fc = json.loads(request.data['fc'])
    jobsetId = request.data['jobsetId']
    running_jobs = r.lrange('{}_watch'.format(jobsetId), 0, 20)
    cancel_existing_jobs = request.data['cancelExistingJobs'] if 'cancelExistingJobs' in request.data else True
    # Stop all running job to free up the worker and remove all failed jobs
    stop_running_jobs(running_jobs, jobsetId)
    if cancel_existing_jobs:
        delete_all_jobs()
    msg = {
        'SYSTEM_STATUS': STATUS_CODES['RQ_RUN_IN_PROCESS'], 'jobsetId': jobsetId, 'FAILED_NODES': '', 'RUNNING_NODES': ''}
    send_msg_to_socket(msg=msg)
    func = getattr(globals()['watch'], 'run')
    job_id = '{}_{}'.format(jobsetId, datetime.now())
    r.lpush('{}_watch'.format(jobsetId), job_id)
    q.enqueue(func,
              job_timeout='3m',
              on_failure=report_failure,
              job_id=job_id,
              kwargs={'fc': fc, 'jobsetId': jobsetId,
                      'cancel_existing_jobs': cancel_existing_jobs, 'my_job_id': job_id},
              result_ttl=500
              )
    response = {
        'msg': STATUS_CODES['RQ_RUN_IN_PROCESS'],
    }
    return Response(response, status=200)
