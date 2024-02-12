from captain.internal.manager import Manager, TSManager

manager = Manager()
"""
MANAGER INSTANCE
___________________
Used for storing the current topology and websocket connections,
bridge between workers, topology, and more.
"""

ts_manager = TSManager()
"""
TEST SEQUENCER MANAGER INSTANCE
___________________
Used for communicating with the Test Sequencer UI
"""

# TODO - get from env variables
origins = ["http://localhost:5391"]
"""
CORS CONFIG
___________________
Used for CORS configuration
"""
