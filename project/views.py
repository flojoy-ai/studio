import yaml
from django.conf import settings
import redis
from rest_framework.decorators import api_view
from rest_framework.response import Response

# Connect to our Redis instance
redis_instance = redis.StrictRedis(host=settings.REDIS_HOST,
                                  port=settings.REDIS_PORT, db=0)

STATUS_CODES = yaml.load(open('STATUS_CODES.yml', 'r'), Loader=yaml.Loader);

@api_view(['GET'])
def ping(request):
    response = {
        'msg': STATUS_CODES['SERVER_ONLINE'],
    }
    return Response(response, status=200)