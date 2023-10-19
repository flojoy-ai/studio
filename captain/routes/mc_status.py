"""USED TO CHECK MICROCONTROLLER STATUS"""

import subprocess
import tempfile
import time
from fastapi import APIRouter
from captain.types.mc import HasRequirements
from captain.utils.logger import logger
from precompilation.config import COMMAND_TESTS

router = APIRouter(tags=["mc_status"])

class MCRequirements:
    def __init__(self, status, msg):
        self.status = status
        self.msg = msg


@router.post("/mc_has_requirements", summary="checks if the microcontroller has the necessary requirements")
async def mc_has_requirements(req: HasRequirements):

    status = "FAIL" # default status 
    port = req.port

    # connect to microcontroller using by spawning subprocess using rshell 
    # and running the list of commands and catch any error
    try:
        # with subprocess.Popen(
        #     cmd,
        #     stdin=subprocess.PIPE,
        #     stdout=subprocess.PIPE,
        #     stderr=subprocess.PIPE,
        #     universal_newlines=True,
        # ) as proc:
        #     # open the repl in rshell
        #     out, error_output = proc.communicate(
        #         cmd
        #     )
        #     logger.debug(f"stdin from shell: {out}")
        #     if error_output or out != '':
        #         raise Exception(f"{error_output}")

        #     for cmd, err_msg in COMMAND_TESTS:
        #         out, error_output = proc.communicate(
        #             cmd
        #         )
        #         logger.debug(f"stdin from shell: {out}")
        #         if error_output or out != '':
        #             raise Exception(f"{err_msg}:{error_output}") if error_output else Exception(f"{err_msg}")
        #     status = 'PASS'
        cmd = ["mpremote", "connect", port, "run"]
        for test, expected_output, err_msg in COMMAND_TESTS:
            tmpfile = tempfile.NamedTemporaryFile()
            tmpfilename = tmpfile.name
            print("here", flush=True)
            f = open(tmpfilename, 'w')
            f.write(test)
            f.close()
            print("here2", flush=True)
            p = subprocess.run(
                cmd + [tmpfilename],
                stdin=subprocess.PIPE,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                universal_newlines=True,
                timeout=5,
            )
            exitcode = p.returncode
            print("here3", flush=True)
            # check if no error was generated
            # get sterr output from Popen process
            stdout = ""
            tmpfile.close()

            if exitcode != 0:
                raise Exception(f"{err_msg}. Failing test: {test}. Error:{p.stderr}")
            
            # check if expected output matches
            if expected_output and stdout != expected_output:
                raise Exception(f"{test};{err_msg}:{p.stdout}")
            
        status = "PASS"

            
    except Exception as e:
        logger.error(e)
        status = 'FAIL'
        return MCRequirements(status, str(e))

    if status != "PASS" and status != "FAIL": 
        raise Exception("Invalid status received from microcontroller")
    
    return MCRequirements(status, "The MC is ready") if status == 'PASS' else MCRequirements(status, "MC was not able to execute the tests")
