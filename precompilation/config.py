# Header will be displayed at the top of the output script
import os
import sys
from precompilation.utils.file_filters.convert_numpy_to_ulab import (
    convert_numpy_to_ulab,
)
from precompilation.utils.file_filters.minify import minify
from precompilation.containers.file_group import FileGroupContainer
from precompilation.templates.functions.utilities.requirements import has_requirements

# This is the string that will be displayed at the top of the output script
HEADER = "'''\nThis file was automatically generated by flojoy.\n'''"

# This is the path to directory containing the file groups to be added
EXTRA_FILES_DIR = "precompilation/templates/extra_files"
EXTRA_FILES_DIR = os.path.join(sys.path[0], EXTRA_FILES_DIR)

# this is the path to the mpy-cross compiler
PATH_TO_MPY_CROSS_COMPILER = "ulab/micropython/mpy-cross/mpy_cross"
PATH_TO_MPY_CROSS_COMPILER = os.path.join(sys.path[0], PATH_TO_MPY_CROSS_COMPILER)




# TODO - get these guys from env variables

"""
FILE FILTERS
________________________________________________________
These filters are applied to all python files in the output directory.
You can quickly turn them on and off accordingly and change their order.
"""
FILTERS_FOR_FILES = [(convert_numpy_to_ulab, True), (minify, True)]
"""
________________________________________________________
"""

"""
COMMAND TESTS
________________________________________________________
These commands are going to be attempted to be ran on the microcontroller to check
if it has the necessary requirements to run the flowchart.
"""
COMMAND_TESTS = [
    ("", "", "Not an MC, or Micropython not installed"),
    ("import ulab", "", "Ulab is not installed"),
]


"""
EXTRA FILES TO OUTPUT
________________________________________________________
These files groups (located in precompilation/templates/) are outputted to the output directory.
The container below defines which file groups are allowed to be outputted.
NOTE: the output paths are relative to self.path_to_output
"""
FILES_GROUPS_TO_BE_OUTPUTTED = FileGroupContainer(
    {"typing": ""},
)
"""
________________________________________________________
"""

"""
MC STATUS CODES
________________________________________________________
These are the status codes that are returned by the microcontroller.
Or, variables pertaining to the status codes.
"""
PATH_TO_MC_STATUS_CODES_YML = "MC_STATUS_CODES"


"""
FIRMWARE PATH FOR MICROCONTROLLERS
___________________
Used for storing the firmware path for microcontrollers
"""
RP2_FIRMWARE_PATH = "precompilation/ressources/rp2-firmware/firmware.uf2"
