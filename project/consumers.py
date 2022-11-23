import yaml
import time
import redis
from django.conf import settings
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from schedule import Scheduler
import threading
import asyncio

# Connect to our Redis instance
redis_instance = redis.StrictRedis(host=settings.REDIS_HOST,
                                   port=settings.REDIS_PORT, db=0, decode_responses=True)

STATUS_CODES = yaml.load(open('STATUS_CODES.yml', 'r'), Loader=yaml.Loader)
lastSysStatus = ""


def run_continuously(self, interval=1):
    cease_continuous_run = threading.Event()

    class ScheduleThread(threading.Thread):

        @classmethod
        def run(cls):
            while not cease_continuous_run.is_set():
                self.run_pending()
                time.sleep(interval)

    continuous_thread = ScheduleThread()
    continuous_thread.setDaemon(True)
    continuous_thread.start()
    return cease_continuous_run


Scheduler.run_continuously = run_continuously


def get_response():
    global lastSysStatus
    sysStatus = redis_instance.get(
        'SYSTEM_STATUS')
    failed_nodes = redis_instance.lrange('FAILED_NODES',0,10);
    response = {
        'type': 'ping_response',
        'msg': '',
        'io': '',
        'running': redis_instance.get('RUNNING_NODE'),
        'failed': failed_nodes,
        'failureReason': redis_instance.lrange('FAILED_REASON',0,10)
    }
    if lastSysStatus != sysStatus:
        lastSysStatus = sysStatus
        response['type'] = 'ping_response'
        response['msg']: lastSysStatus
    if sysStatus == None:
        response['msg'] = 'ts'
    elif sysStatus == STATUS_CODES['RQ_RUN_COMPLETE']:
        job_results = redis_instance.get(
            'COMPLETED_JOBS')
        response['type'] = 'heartbeat_response'
        response['io'] = job_results
        response['msg'] = lastSysStatus

    else:
        response['msg'] = str(
            sysStatus).lower().replace('_', ' ')
    response['running'] = redis_instance.get(
        'RUNNING_NODE')
    return response


class FlojoyConsumer(AsyncJsonWebsocketConsumer):
    send_count = 0

    async def connect(self):
        await self.accept()

        await self.send_json({
            'type': 'connection_established',
            'message': 'You are now connected to flojoy servers'
        })

        def get_redis_status():
            asyncio.run(self.send_message(get_response()))
            return

        def start_scheduler():
            scheduler = Scheduler()
            scheduler.every().seconds.do(get_redis_status)
            scheduler.run_continuously()
        start_scheduler()

    async def send_message(self, text):
        await self.send_json(text)
        if (text['type'] == 'heartbeat_response'):
            self.send_count += 1
            print('send count: ', self.send_count)
            if (self.send_count == 3):
                redis_instance.set(
                    'SYSTEM_STATUS', STATUS_CODES['STANDBY'])
                self.send_count = 0
        return
