import functools
import logging
import traceback
from flojoy import JobFailure, JobSuccess
from PYTHON.utils.mecademic_state.mecademic_state import query_for_handle

logger = logging.getLogger("MECADEMIC ROBOT LOG")
logger.setLevel(logging.DEBUG)


def safe_robot_operation(func):
    """
    Currently only does basic logging, so the function is a misnomer.
    TODO: Look into it not breaking the robot connection if there is an error during the execution of a mecademic node.
    """
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        try:
            logger.info(f"\nExecuting node: {func.__name__}")
            output = func(*args, **kwargs)
            node_success = "FAILED" if isinstance(
                output, JobFailure) else "SUCCEEDED"
            logger.info(f"\nNode execution {node_success}")

            if isinstance(output, JobSuccess):
                robot = query_for_handle(output.result["text_blob"])

                X, Y, Z, alpha, beta, gamma = robot.GetPose()
                joint_pose = robot.GetRtTargetJointPos()

                wrt_pose = X, Y, Z
                wrt_twist = alpha, beta, gamma

                logger.info(
                    f"Robot poses:\n\t{wrt_pose = }\n\t{wrt_twist = }\n\t{joint_pose = }")
            elif isinstance(output, JobFailure):
                pass

        except Exception as e:
            logger.error(str(e))
            logger.error("error occurred while running the node")
            logger.debug(traceback.format_exc())

        finally:
            return output

    return wrapper
