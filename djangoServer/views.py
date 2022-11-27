from PYTHON.WATCH import *
import yaml
import uptime
from django.conf import settings
import redis
from rest_framework.decorators import api_view
from rest_framework.response import Response
import json
import sys
from django.shortcuts import render
import os
from rq import Queue
dir_path = os.path.dirname(os.path.realpath(__file__))
sys.path.insert(0, dir_path)
REDIS_HOST = os.environ.get('REDIS_HOST', 'localhost')
REDIS_PORT = os.environ.get('REDIS_PORT', 6379)
# Connect to our Redis instance
redis_instance = redis.StrictRedis(host=settings.REDIS_HOST,
                                   port=settings.REDIS_PORT, db=0)

STATUS_CODES = yaml.load(open('STATUS_CODES.yml', 'r'), Loader=yaml.Loader)
r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT)
q = Queue('flojoy-watch', connection=r)


def test_socket(request):
    return render(request, 'test_socket.html')


def report_failure(job, connection, type, value, traceback):
    print(job, connection, type, value, traceback)


@api_view(['GET'])
def ping(request):
    response = {
        'msg': STATUS_CODES['SERVER_ONLINE'],
    }
    return Response(response, status=200)


lastSysStatus = ""


@api_view(['GET'])
def heartbeat(request):
    sysStatus = redis_instance.get('SYSTEM_STATUS')
    ts = '⏰ server uptime: ' + str(uptime.uptime())
    response = {
        'msg': '',
        'clock': ts
    }

    global lastSysStatus
    if sysStatus != lastSysStatus:
        print('sysStatus', sysStatus)
    lastSysStatus = sysStatus

    if sysStatus == None:
        response['msg'] = ts
    elif sysStatus == STATUS_CODES['RQ_RUN_COMPLETE']:
        response['msg'] = STATUS_CODES['RQ_RUN_COMPLETE']
        redis_instance.set('SYSTEM_STATUS', STATUS_CODES['STANDBY'])
    else:
        response['msg'] = str(sysStatus).lower().replace('_', ' ')

    return Response(response, status=200)


@api_view(['GET'])
def io(request):
    result = redis_instance.get('COMPLETED_JOBS')

    ts = '⏰ server uptime: ' + str(uptime.uptime())
    response = {
        'msg': STATUS_CODES['MISSING_RQ_RESULTS'],
        'clock': ts,
        'io': {}
    }

    if isinstance(result, str):
        result = result.replace(' ', '')
        print(result[:20])
        response['msg'] = STATUS_CODES['RQ_RESULTS_RETURNED']
        response['io'] = result

    return Response(response, status=200)


@api_view(['POST'])
def wfc(request):
    print('Flow chart payload... ', request.data['fc'][:300])

    fc = json.loads(request.data['fc'])
    jobsetId = request.data['jobsetId']
    cancel_existing_jobs = request.data['cancelExistingJobs'] if 'cancelExistingJobs' in request.data else True
    redis_instance.set(jobsetId, json.dumps(
        {'SYSTEM_STATUS': STATUS_CODES['RQ_RUN_IN_PROCESS']}))
    func = getattr(globals()['watch'], 'run')
    # RUN.run_watch(fc= fc, jobsetId=jobsetId, cancel_existing_jobs= cancel_existing_jobs)
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
