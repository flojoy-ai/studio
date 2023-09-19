import mecademicpy.robot as mdr

robot: mdr.Robot = mdr.Robot()
robot.Connect(address='192.168.0.100')
robot.WaitConnected()
robot.ActivateRobot()
robot.WaitActivated()
robot.Home()
robot.WaitHomed()

robot.MoveJoints(0, -60,60,0,0,0)
robot.WaitIdle()
robot.DeactivateRobot()
robot.Disconnect()

robot.Connect(address='192.168.0.100')
robot.WaitConnected()
robot.ActivateRobot()
robot.WaitActivated()
robot.Home()
robot.WaitHomed()

robot.MoveJoints(0, -30,60,0,0,0)
robot.WaitIdle()
robot.DeactivateRobot()
robot.Disconnect()

robot.Connect(address='192.168.0.100')
robot.WaitConnected()
robot.ActivateRobot()
robot.WaitActivated()
robot.Home()
robot.WaitHomed()

robot.MoveJoints(0, -30,30,0,0,0)
robot.WaitIdle()
robot.DeactivateRobot()
robot.Disconnect()