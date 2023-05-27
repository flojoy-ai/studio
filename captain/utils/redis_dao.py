import os
import redis

class RedisDao:
    def __init__(self, host=os.environ.get("REDIS_HOST", "localhost"), \
                  port=int(os.environ.get("REDIS_PORT", "6379"))):
        self.redis_instance = redis.Redis(host=host, port=port)
    
    def get(self, key):
        return self.redis_instance.get(key)
    
    def set(self, key, value):
        return self.redis_instance.set(key, value)

