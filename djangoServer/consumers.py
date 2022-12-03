import yaml
import time
import redis
from django.conf import settings
from channels.generic.websocket import WebsocketConsumer
from schedule import Scheduler
import threading
import uuid
import json
import uptime
from asgiref.sync import async_to_sync

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
    all_nodes = redis_instance.lrange(socketId+'_ALL_NODES', 0, 40) or []
    all_results = redis_instance.lrange(socketId+'_NODE_RESULTS', 0, 40) or []

    response = {
        'type': 'ping_response',
        'msg': '',
        'io': all_results,
        'running': sysStatus['RUNNING_NODE'] if sysStatus is not None and 'RUNNING_NODE' in sysStatus else '',
        'failed': sysStatus['FAILED_NODES'] if sysStatus is not None and 'FAILED_NODES' in sysStatus else [],
        'failureReason': [],
    }
    if all_results.__len__() > 0 and all_results.__len__() == all_nodes.__len__():
        response['type'] = 'heartbeat_response'
        response['msg'] = '🤙 python script run successful'
        return response
    if sysStatus is not None and 'SYSTEM_STATUS' in sysStatus and lastSysStatus != sysStatus['SYSTEM_STATUS']:
        lastSysStatus = sysStatus['SYSTEM_STATUS']
        response['type'] = 'ping_response'
        response['msg'] = lastSysStatus
    if sysStatus == None:
        response['msg'] = ts
    else:
        if 'SYSTEM_STATUS' in sysStatus:
            response['msg'] = str(
                sysStatus['SYSTEM_STATUS']).lower().replace('_', ' ')
    response['running'] = sysStatus[
        'RUNNING_NODE'] if sysStatus is not None and 'RUNNING_NODE' in sysStatus else ''
    return json.dumps(response)


class FlojoyConsumer(WebsocketConsumer):
    socketId = ''

    def connect(self):
        self.accept()
        self.room_group_name = 'flojoy'
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )
        id = uuid.uuid1().__str__()
        while redis_instance.get(id) is not None:
            id = uuid.uuid1().__str__()
        self.socketId = id
        self.send(json.dumps({
            'type': 'connection_established',
            'msg': 'You are now connected to flojoy servers',
            'socketId': self.socketId
        }))
        redis_instance.set(self.socketId, json.dumps(
            {'SYSTEM_STATUS': STATUS_CODES['STANDBY']}))

        # def get_redis_status():
        #     self.send_message(get_response
        #                       (self.socketId))
        #     return

        # def start_scheduler():
        #     scheduler = Scheduler()
        #     scheduler.every().seconds.do(get_redis_status)
        #     scheduler.run_continuously()
        # start_scheduler()

    def send_message(self, text):
        self.send(text)
        return

    def receive(self, text_data=None,):
        text_data_json = json.loads(text_data)
        if text_data_json['type'] == 'heartbeat_received':
            redis_instance.delete(self.socketId+'_ALL_NODES')
            redis_instance.delete(self.socketId+'_NODE_RESULTS')
            redis_instance.set(self.socketId, json.dumps({
                'SYSTEM_STATUS': STATUS_CODES['STANDBY']}))

    def worker_response(self, event):
        if(event['jobsetId'] == self.socketId):
            # print(' socket sending event: ', event)
            self.send(json.dumps(event))
