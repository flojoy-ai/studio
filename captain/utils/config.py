from captain.internal.manager import Manager
import os

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
origins = (
    ["*"]
    if os.getenv("DEPLOY_ENV") == "remote"
    else ["http://127.0.0.1:5391", "http://localhost:5391"]
)
