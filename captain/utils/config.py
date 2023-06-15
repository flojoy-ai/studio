from captain.internal.manager import Manager
manager = Manager()

'''
CORS CONFIG
___________________
Used for CORS configuration
'''
origins = [
    "http://localhost:3000"
]

'''
REDIS CONFIG
___________________
Used for Redis connection
'''
# TODO  - get from env variables
REDIS_HOST = "localhost"
REDIS_PORT = 6379