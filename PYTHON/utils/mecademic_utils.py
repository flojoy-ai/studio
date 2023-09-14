import mecademicpy.robot as mdr


def check_connection(robot: mdr.Robot):
    if not robot.IsConnected():
        raise ValueError("Robot connection failed.")