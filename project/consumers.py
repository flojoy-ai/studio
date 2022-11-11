import json
from channels.generic.websocket import AsyncJsonWebsocketConsumer


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
            await self.send_json({
                'type': 'pong',
                'message': 'You are now getting pinged'
            })
    
    # def connect(self):
    #     self.accept()
        
    #     self.send(text_data=json.dumps({
    #         'type': 'connection_established',
    #         'message': 'You are now connected to flojoy server'
    #     }))
    
    # def receive(self, text_data):
    #     text_data_json = json.loads(text_data)
    #     message = text_data_json['message']
        
    #     print('Message:', message)
        
    #     self.send(text_data=json.dumps({
    #         'type': 'chat', 
    #     }))
        
    # def disconnect(self, code):
    #     pass