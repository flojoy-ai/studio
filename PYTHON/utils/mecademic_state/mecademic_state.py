from flojoy import TextBlob
import mecademicpy.robot as mdr

_robot_handle_map = None
def get_robot_handle_map():
    global _robot_handle_map
    if _robot_handle_map is None:
        _robot_handle_map = {}
    return _robot_handle_map

def init_handle_map(allow_reinit: bool = False):
    global _robot_handle_map
    if _robot_handle_map is not None and not allow_reinit:
        raise ValueError("Robot handle map already initialized.")
    _robot_handle_map = None


def query_for_handle(ip_address: str | TextBlob) -> mdr.Robot | None:
    """
    Queries the robot handle map for a handle with the given IP address.
    If a handle is not found, a new handle is created and added to the map.
    """
    if isinstance(ip_address, TextBlob):
        ip_address: str = ip_address.text_blob # unbox TextBlob
    robot_handle_map = get_robot_handle_map()
    if ip_address in robot_handle_map:
        return robot_handle_map[ip_address]
    else:
        raise KeyError("No handle for IP address: " + ip_address)

def add_handle(ip_address: str):
    """
    Adds a handle to the robot handle map.
    TODO: This is blocking synchronous code. Migrate to async await.
    """
    if ip_address in get_robot_handle_map():
        raise ValueError("Robot handle already exists for IP address: " + ip_address)

    robot_handle_map = get_robot_handle_map()
    robot = mdr.Robot()
    robot.Connect(ip_address)
    robot.WaitConnected()
    robot_handle_map[ip_address] = robot

def remove_handle(ip_address: str):
    """
    Removes a handle from the robot handle map.
    """
    if ip_address not in get_robot_handle_map():
        raise ValueError("Robot handle does not exist for IP address: " + ip_address)

    robot_handle_map = get_robot_handle_map()
    robot_handle_map[ip_address].Disconnect()
    del robot_handle_map[ip_address]


def destruct_handle_map():
    """
    Disconnects all robot handles and deletes the robot handle map.
    TODO: Warning! This destruct must ALWAYS be called on closing or crashing of the program.
    """
    robot_handle_map = get_robot_handle_map()
    for ip_address in robot_handle_map:
        robot_handle_map[ip_address].Disconnect()
    del robot_handle_map
