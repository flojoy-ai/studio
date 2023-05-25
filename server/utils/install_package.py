from subprocess import Popen, PIPE, SubprocessError
from .send_to_socket import send_msg_to_socket


def stream_response(proc):
    while True:
        line = proc.stdout.readline() or proc.stderr.readline()
        if not line:
            break
        yield line


async def install_packages(missing_packages, socket_msg):
    try:
        cmd = ["pip", "install"] + missing_packages
        proc = Popen(cmd, stdout=PIPE, stderr=PIPE)
        while proc.poll() is None:
            stream = stream_response(proc)
            for line in stream:
                socket_msg["PRE_JOB_OP"]["output"] = line.decode(encoding="utf-8")
                await send_msg_to_socket(socket_msg)
        return_code = proc.returncode
        if return_code != 0:
            return False
        return True
    except (SubprocessError, Exception) as e:
        output = "\n".join(e.args)
        socket_msg["PRE_JOB_OP"]["output"] = output
        await send_msg_to_socket(socket_msg)
        return False
