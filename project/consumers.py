import json
import yaml
import uptime
import redis
from django.conf import settings
from channels.generic.websocket import AsyncJsonWebsocketConsumer

# Connect to our Redis instance
redis_instance = redis.StrictRedis(host=settings.REDIS_HOST,
                                  port=settings.REDIS_PORT, db=0)

STATUS_CODES = yaml.load(open('STATUS_CODES.yml', 'r'), Loader=yaml.Loader);
lastSysStatus = ""

class FlojoyConsumer(AsyncJsonWebsocketConsumer):
    
    async def connect(self):
        await self.accept()
        
        await self.send_json({
            'type': 'connection_established',
            'message': 'You are now connected to flojoy servers'
        })

    async def receive(self, text_data=None, bytes_data=None, **kwargs):
        text_data_json = json.loads(text_data)
        print(text_data_json)
        
        if text_data_json['type'] == 'ping':
            
            response = {
                'type': 'ping_response',
                'msg': STATUS_CODES['SERVER_ONLINE']
            }
            await self.send_json(response)

        elif text_data_json['type'] == 'heartbeat':
            
            sysStatus = redis_instance.get('SYSTEM_STATUS') 
            ts = '⏰ server uptime: ' + str(uptime.uptime());
            
            response = {
                'type': 'heartbeat_response',
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
                
            await self.send_json(response)