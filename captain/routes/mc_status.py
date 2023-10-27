"""USED TO CHECK MICROCONTROLLER STATUS"""

import subprocess
from fastapi import APIRouter
from captain.services.file_uploader.file_uploader import FileUploader
from captain.types.mc import HasRequirements, MCTestError, NoPortError, UploadFirmware
from captain.utils.logger import logger
from captain.utils.microcontroller_ping import run_test, verify_test
from precompilation.config import COMMAND_TESTS, PATH_TO_MC_STATUS_CODES_YML, RP2_FIRMWARE_PATH
import yaml

router = APIRouter(tags=["mc_status"])


class MCRequirements:
    def __init__(self, code, status, msg):
        self.code = code  # refer to MC_STATUS_CODES.yml for meaning of codes
        self.status = status
        self.msg = msg

@router.post("/mc_firmware_upload")
async def mc_firmware_upload(req: UploadFirmware):
    fu = FileUploader()
    fu.set_target(RP2_FIRMWARE_PATH)\
    .set_destination(req.destination)\
    .upload()


@router.get("/mc_status_codes")
async def mc_status_codes():
    # load yaml file by the name of MC_STATUS_CODES.yml
    with open(f"{PATH_TO_MC_STATUS_CODES_YML}.yml", "r") as stream:
        try:
            data = yaml.safe_load(stream)
            return data
        except yaml.YAMLError as exc:
            print(exc)
            raise Exception("Error loading yaml file")


@router.post(
    "/mc_has_requirements",
    summary="checks if the microcontroller has the necessary requirements",
)
async def mc_has_requirements(req: HasRequirements):
    status = "FAIL"  # default status
    port = req.port
    
    try:

        if not port:
            raise NoPortError()

        for test, expected_output, err_msg in COMMAND_TESTS:
            p = run_test(test, port)
            verify_test(p, test, expected_output, err_msg, MCTestError)
        status = "PASS"

    except subprocess.TimeoutExpired as e:
        logger.error("Timeout error")
        status = "FAIL"
        return MCRequirements(2, status, "Timeout error")
    
    except NoPortError as e:
        logger.error(e.message)
        status = "FAIL"
        return MCRequirements(3, status, e.message)

    except MCTestError as e:
        logger.error(e.message)
        status = "FAIL"
        return MCRequirements(1, status, e.message)

    except Exception as e:
        logger.error(e)
        status = "FAIL"
        return MCRequirements(4, status, "MC was not able to execute the tests")

    if status != "PASS" and status != "FAIL":
        raise Exception("Invalid status received from microcontroller")

    return (
        MCRequirements(0, status, "The MC is ready")
        if status == "PASS"
        else MCRequirements(4, status, "MC was not able to execute the tests")
    )
