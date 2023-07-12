from captain.internal.manager import Manager

"""
MANAGER INSTANCE
___________________
Used for storing the current topology and websocket connections,
bridge between workers, topology, and more.
"""
manager = Manager()

"""
CORS CONFIG
___________________
Used for CORS configuration
"""
# TODO - get from env variables
origins = ["http://localhost:3000"]
