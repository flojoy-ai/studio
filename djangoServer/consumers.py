import json
import uuid

import yaml
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer

STATUS_CODES = yaml.load(open('STATUS_CODES.yml', 'r'), Loader=yaml.Loader)


class FlojoyConsumer(WebsocketConsumer):
    socketId = ''
    all_sockets = []

    def connect(self):
        self.accept()
        self.room_group_name = 'flojoy'
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )
        _id = uuid.uuid1().__str__()
        while _id in self.all_sockets:
            _id = uuid.uuid1().__str__()
        self.socketId = _id
        self.all_sockets.append(_id)
        self.send(json.dumps({
            'type': 'connection_established',
            'msg': 'You are now connected to flojoy servers',
            'socketId': self.socketId,
            'SYSTEM_STATUS': STATUS_CODES['STANDBY']
        }))

    def disconnect(self, code):
        if self.socketId in self.all_sockets:
            self.all_sockets.remove(self.socketId)
        return super().disconnect(code)

    def worker_response(self, event):
        if (event['jobsetId'] == self.socketId):
            self.send(json.dumps(event))
