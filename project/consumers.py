import yaml
import time
import redis
from django.conf import settings
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from schedule import Scheduler
import threading
import asyncio
import uuid
import json
import uptime

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

def get_response(socketId):
    global lastSysStatus
    loadSysStatus = redis_instance.get(socketId)
    sysStatus = json.loads(
        loadSysStatus) if loadSysStatus is not None else None
    ts = '⏰ server uptime: ' + str(uptime.uptime())
    response = {
        'type': 'ping_response',
        'msg': '',
        'io': '',
        'running': sysStatus['RUNNING_NODE'] if sysStatus is not None and 'RUNNING_NODE' in sysStatus else '',
        'failed': sysStatus['FAILED_NODES'] if sysStatus is not None and 'FAILED_NODES' in sysStatus else [],
        'failureReason': []
    }
    if sysStatus is not None and 'SYSTEM_STATUS' in sysStatus and lastSysStatus != sysStatus['SYSTEM_STATUS']:
        lastSysStatus = sysStatus['SYSTEM_STATUS']
        response['type'] = 'ping_response'
        response['msg'] = lastSysStatus
    if sysStatus == None:
        response['msg'] = ts
    elif 'SYSTEM_STATUS' in sysStatus and sysStatus['SYSTEM_STATUS'] == STATUS_CODES['RQ_RUN_COMPLETE']:
        job_results = sysStatus['COMPLETED_JOBS']
        response['type'] = 'heartbeat_response'
        response['io'] = job_results
        response['msg'] = lastSysStatus

    else:
        if 'SYSTEM_STATUS' in sysStatus:
            response['msg'] = str(
                sysStatus['SYSTEM_STATUS']).lower().replace('_', ' ')
    response['running'] = sysStatus[
        'RUNNING_NODE'] if sysStatus is not None and 'RUNNING_NODE' in sysStatus else ''
    return response


class FlojoyConsumer(AsyncJsonWebsocketConsumer):
    send_count = 0
    socketId = ''

    async def connect(self):
        await self.accept()
        id = uuid.uuid1().__str__()
        while redis_instance.get(id) is not None:
            id = uuid.uuid1().__str__()
        self.socketId = id
        await self.send_json({
            'type': 'connection_established',
            'msg': 'You are now connected to flojoy servers',
            'socketId': self.socketId
        })
        redis_instance.set(self.socketId, json.dumps(
            {'SYSTEM_STATUS': STATUS_CODES['STANDBY']}))

        def get_redis_status():
            asyncio.run(self.send_message(get_response(self.socketId)))
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
                redis_instance.set(self.socketId, json.dumps({
                    'SYSTEM_STATUS': STATUS_CODES['STANDBY']}))
                self.send_count = 0
        return
